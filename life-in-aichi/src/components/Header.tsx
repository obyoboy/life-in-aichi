"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGUAGES, LANG_META, type Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";

export function Header({ lang, t }: { lang: Lang; t: Translations }) {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Build lang-switch URL: replace /en/ with /vi/ etc.
  const buildLangUrl = (targetLang: Lang) => {
    return pathname.replace(`/${lang}`, `/${targetLang}`);
  };

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <Link href={`/${lang}`} className="logo-area" aria-label={t.siteTitle}>
          <div className="logo-icon">🌏</div>
          <div>
            <div className="logo-title">{t.siteTitle}</div>
            <div className="logo-sub">{t.siteSubtitle}</div>
          </div>
        </Link>

        <div className="lang-switcher" ref={ref}>
          <button
            type="button"
            className="lang-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label={`${t.langLabel}: ${lang.toUpperCase()}`}
            aria-haspopup="menu"
            aria-expanded={showMenu}
          >
            {lang.toUpperCase()} ▾
          </button>
          {showMenu && (
            <div className="lang-dropdown" role="menu" aria-label={t.langLabel}>
              {LANGUAGES.map((l) => (
                <Link
                  key={l}
                  href={buildLangUrl(l)}
                  className={`lang-option ${l === lang ? "active" : ""}`}
                  role="menuitemradio"
                  aria-checked={l === lang}
                  onClick={() => setShowMenu(false)}
                >
                  {LANG_META[l].flag} {LANG_META[l].label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
