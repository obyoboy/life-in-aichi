import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article } from "@/data/articles";

const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  vi: "vi-VN",
  tl: "fil-PH",
  ja: "ja-JP",
};

function buildArchive(articles: Article[], lang: string): { label: string; count: number; ym: string }[] {
  const locale = LOCALE_MAP[lang] ?? "en-US";
  const counts: Record<string, number> = {};
  for (const a of articles) {
    const ym = a.sections.s9.slice(0, 7);
    counts[ym] = (counts[ym] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 6)
    .map(([ym, count]) => {
      const [y, m] = ym.split("-");
      const date = new Date(parseInt(y), parseInt(m) - 1, 1);
      const label = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(date);
      return { label, count, ym };
    });
}

export function SidebarArchive({
  lang,
  t,
  articles,
}: {
  lang: Lang;
  t: Translations;
  articles: Article[];
}) {
  const archive = buildArchive(articles, lang);
  if (archive.length === 0) return null;

  return (
    <div className="sidebar-section sidebar-archive">
      <h2 className="sidebar-heading">{t.sidebarArchive}</h2>
      <ul className="sidebar-archive-list">
        {archive.map(({ label, count, ym }) => (
          <li key={ym}>
            <Link href={`/${lang}/articles?ym=${ym}`} className="sidebar-archive-item">
              <span className="sidebar-archive-label">{label}</span>
              <span className="sidebar-archive-count">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
