#!/usr/bin/env python3
"""
Life in Aichi — Site Monitor
Crawls configured sources, detects new/updated pages, filters by keywords.
Outputs candidate JSON for human review.
"""

import hashlib
import json
import os
import re
import sys
import time
from datetime import date, datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# ─── Paths ───
ROOT = Path(__file__).resolve().parent.parent.parent
CONFIG_PATH = ROOT / "config" / "sources.json"
SNAPSHOTS_DIR = ROOT / "data" / "snapshots"
CANDIDATES_DIR = ROOT / "data" / "candidates"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def fetch_page(url: str, config: dict) -> str | None:
    """Fetch a page with configured user agent, timeout, and retries."""
    headers = {"User-Agent": config["user_agent"]}
    timeout = config.get("timeout_seconds", 15)
    max_retries = config.get("max_retries", 2)

    for attempt in range(max_retries + 1):
        try:
            resp = requests.get(url, headers=headers, timeout=timeout)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding or "utf-8"
            return resp.text
        except requests.RequestException as e:
            print(f"  [WARN] Attempt {attempt + 1} failed for {url}: {e}")
            if attempt < max_retries:
                time.sleep(config.get("request_interval_seconds", 3))
    return None


def extract_text(html: str) -> str:
    """Extract visible text from HTML."""
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def extract_title(html: str) -> str:
    """Extract page title."""
    soup = BeautifulSoup(html, "lxml")
    title_tag = soup.find("title")
    return title_tag.get_text(strip=True) if title_tag else ""


def extract_links(html: str, base_url: str, selector: str) -> list[str]:
    """Extract links matching the selector, resolve to absolute URLs."""
    soup = BeautifulSoup(html, "lxml")
    links = set()
    for a_tag in soup.select(selector):
        href = a_tag.get("href")
        if not href or href.startswith("#") or href.startswith("mailto:"):
            continue
        absolute = urljoin(base_url, href)
        # Only keep same-domain links
        if urlparse(absolute).netloc == urlparse(base_url).netloc:
            # Remove fragments
            absolute = absolute.split("#")[0]
            links.add(absolute)
    return sorted(links)


def content_hash(text: str) -> str:
    """Generate a hash of the content for change detection."""
    normalized = re.sub(r"\s+", " ", text.strip())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()[:16]


def matches_keywords(text: str, keywords: list[str]) -> list[str]:
    """Check which keywords appear in the text."""
    text_lower = text.lower()
    return [kw for kw in keywords if kw.lower() in text_lower]


def load_snapshot(source_id: str) -> dict:
    """Load previous snapshot for a source."""
    path = SNAPSHOTS_DIR / f"{source_id}.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_snapshot(source_id: str, snapshot: dict):
    """Save snapshot for a source."""
    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    path = SNAPSHOTS_DIR / f"{source_id}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)


class RobotsChecker:
    """Per-domain robots.txt checker using urllib.robotparser.
    Conservative: if robots.txt cannot be fetched or parsed, deny access to that domain."""

    def __init__(self, user_agent: str):
        self.user_agent = user_agent
        self._parsers: dict[str, object] = {}
        self._denied_domains: set[str] = set()

    def _get_parser(self, url: str):
        from urllib.robotparser import RobotFileParser

        parsed = urlparse(url)
        domain = f"{parsed.scheme}://{parsed.netloc}"
        if domain in self._denied_domains:
            return None
        if domain not in self._parsers:
            rp = RobotFileParser()
            rp.set_url(f"{domain}/robots.txt")
            try:
                rp.read()
                # Verify the parser actually has rules.
                # RobotFileParser.read() on 4xx may silently set allow_all=True
                # or on network error may leave the parser in an empty state.
                # We check: if last_checked is 0 (never set), read() likely failed silently.
                if not rp.last_checked:
                    print(f"  [WARN] robots.txt for {domain}: read() succeeded but no rules parsed. Denying.")
                    self._denied_domains.add(domain)
                    return None
                self._parsers[domain] = rp
            except Exception as e:
                print(f"  [WARN] robots.txt fetch failed for {domain}: {e}. Denying.")
                self._denied_domains.add(domain)
                return None
        return self._parsers.get(domain)

    def is_allowed(self, url: str) -> bool:
        parser = self._get_parser(url)
        if parser is None:
            return False
        return parser.can_fetch(self.user_agent, url)


def crawl_source(source: dict, config: dict, robots: RobotsChecker) -> tuple[list, list, dict, bool]:
    """
    Crawl a single source.
    Returns (new_candidates, updated_candidates, merged_snapshot, success).
    success=False when base URL fetch fails or robots.txt blocks — caller must count as error.
    """
    source_id = source["id"]
    base_url = source["base_url"]
    print(f"\n[{source_id}] Crawling {source['name']}...")

    # Check robots.txt for base URL
    if not robots.is_allowed(base_url):
        print(f"  [SKIP] Blocked by robots.txt: {base_url}")
        return [], [], {}, False  # P1: mark as failure

    # Load previous snapshot — this is the base we merge into
    old_snapshot = load_snapshot(source_id)
    merged_snapshot = dict(old_snapshot)  # Start with all old entries
    new_candidates = []
    updated_candidates = []
    keywords = config.get("keywords", [])
    interval = config.get("request_interval_seconds", 3)

    # Fetch the base page
    html = fetch_page(base_url, config)
    if not html:
        print(f"  [ERROR] Failed to fetch base page: {base_url}")
        return [], [], old_snapshot, False  # P1: mark as failure

    # Collect URLs to check (crawl_depth controls whether to follow links, not recursion depth)
    urls_to_check = [base_url]
    if source.get("crawl_depth", 0) > 0:
        selector = source.get("link_selector", "a")
        child_links = extract_links(html, base_url, selector)
        urls_to_check.extend(child_links[:50])  # Cap at 50 pages per source

    print(f"  Found {len(urls_to_check)} pages to check")

    for url in urls_to_check:
        # Per-URL robots.txt check
        if not robots.is_allowed(url):
            print(f"  [SKIP] Blocked by robots.txt: {url}")
            continue

        time.sleep(interval)

        page_html = html if url == base_url else fetch_page(url, config)
        if not page_html:
            # Fetch failed — keep old snapshot entry if it exists (P1 fix)
            continue

        text = extract_text(page_html)
        title = extract_title(page_html)
        current_hash = content_hash(text)

        # Update merged snapshot with fresh data (old entries preserved for failed fetches)
        merged_snapshot[url] = {
            "title": title,
            "hash": current_hash,
            "last_checked": date.today().isoformat(),
        }

        # Check for keyword matches
        matched = matches_keywords(text, keywords)
        if not matched:
            continue

        old_entry = old_snapshot.get(url)

        if old_entry is None:
            # New page
            new_candidates.append(
                {
                    "url": url,
                    "source": source["name"],
                    "source_id": source_id,
                    "category": source.get("category", ""),
                    "status": "new",
                    "title": title,
                    "detected_keywords": matched[:10],
                    "content_hash": current_hash,
                }
            )
            print(f"  [NEW] {title[:60]} ({len(matched)} keywords)")
        elif old_entry.get("hash") != current_hash:
            # Updated page
            updated_candidates.append(
                {
                    "url": url,
                    "source": source["name"],
                    "source_id": source_id,
                    "category": source.get("category", ""),
                    "status": "updated",
                    "title": title,
                    "detected_keywords": matched[:10],
                    "content_hash": current_hash,
                    "previous_hash": old_entry.get("hash"),
                    "diff_summary": f"Content changed since {old_entry.get('last_checked', 'unknown')}",
                }
            )
            print(f"  [UPDATED] {title[:60]}")

    return new_candidates, updated_candidates, merged_snapshot, True


def main():
    config = load_config()
    sources = [s for s in config["sources"] if s.get("enabled", True)]
    robots = RobotsChecker(config["user_agent"])

    print(f"Life in Aichi — Site Monitor")
    print(f"Date: {date.today().isoformat()}")
    print(f"Sources: {len(sources)} enabled")
    print("=" * 60)

    all_new = []
    all_updated = []
    errors = 0

    for source in sources:
        try:
            new, updated, snapshot, success = crawl_source(source, config, robots)
            all_new.extend(new)
            all_updated.extend(updated)
            if snapshot:
                save_snapshot(source["id"], snapshot)
            if not success:
                errors += 1  # P1: count fetch failures and robots blocks
        except Exception as e:
            print(f"  [ERROR] {source['id']}: {e}")
            errors += 1

    # Output results
    now = datetime.now()
    result = {
        "crawl_date": date.today().isoformat(),
        "crawl_time": now.isoformat(),
        "sources_checked": len(sources),
        "sources_failed": errors,
        "candidates": all_new,
        "updated": all_updated,
    }

    # Save candidates JSON with timestamp to avoid overwrites on re-run (P4)
    CANDIDATES_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = now.strftime("%Y-%m-%dT%H%M%S")
    output_path = CANDIDATES_DIR / f"{timestamp}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # P2: Write output path to GITHUB_OUTPUT so workflow reads the exact file we just created
    gh_output = os.environ.get("GITHUB_OUTPUT")
    if gh_output:
        with open(gh_output, "a", encoding="utf-8") as f:
            f.write(f"output_file={output_path}\n")
            f.write(f"new_count={len(all_new)}\n")
            f.write(f"updated_count={len(all_updated)}\n")
            f.write(f"errors={errors}\n")

    # Rotate old candidate files — keep last 30 days (P5)
    rotate_old_candidates(days=30)

    # Summary
    print("\n" + "=" * 60)
    print(f"Results:")
    print(f"  New candidates:     {len(all_new)}")
    print(f"  Updated pages:      {len(all_updated)}")
    print(f"  Errors:             {errors}")
    print(f"  Output: {output_path}")

    if all_new or all_updated:
        print("\n--- Candidates ---")
        for c in all_new:
            print(f"  [NEW] {c['title'][:50]}")
            print(f"        {c['url']}")
            print(f"        Keywords: {', '.join(c['detected_keywords'][:5])}")
        for u in all_updated:
            print(f"  [UPD] {u['title'][:50]}")
            print(f"        {u['url']}")
            print(f"        {u['diff_summary']}")

    # Exit codes: 0 = clean, 1 = had errors (warning), 2 = critical (P2)
    if errors > len(sources) // 2:
        print(f"\n[FAIL] Too many errors ({errors}/{len(sources)})")
        return 2
    if errors > 0:
        print(f"\n[WARN] {errors} source(s) had errors")
        return 1
    return 0


def rotate_old_candidates(days: int = 30):
    """Remove candidate files older than N days."""
    from datetime import timedelta
    cutoff_date = date.today() - timedelta(days=days)
    for f in CANDIDATES_DIR.glob("*.json"):
        if f.name == ".gitkeep":
            continue
        try:
            file_date_str = f.stem[:10]
            file_date = date.fromisoformat(file_date_str)
            if file_date < cutoff_date:
                f.unlink()
                print(f"  [ROTATE] Removed old candidate file: {f.name}")
        except (ValueError, IndexError):
            pass


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        # Unhandled exception — distinct exit code 3 so CI can distinguish crash from warning
        import traceback
        print(f"\n[CRASH] Unhandled exception: {e}", file=sys.stderr)
        traceback.print_exc()
        # Try to signal crash to GitHub Actions
        gh_output = os.environ.get("GITHUB_OUTPUT")
        if gh_output:
            try:
                with open(gh_output, "a", encoding="utf-8") as f:
                    f.write("output_file=\n")
                    f.write("new_count=0\n")
                    f.write("updated_count=0\n")
                    f.write("errors=999\n")
                    f.write("crashed=true\n")
            except Exception:
                pass
        sys.exit(3)
