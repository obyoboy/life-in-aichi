import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import { CATEGORIES, CAT_COLORS } from "@/data/articles";

export function SidebarCategories({
  lang,
  t,
  categoryCounts,
  activeCat,
}: {
  lang: Lang;
  t: Translations;
  categoryCounts: Record<string, number>;
  activeCat?: string;
}) {
  const catLabel = (id: string) => {
    const map: Record<string, string> = {
      childcare: t.catChildcare,
      medical: t.catMedical,
      housing: t.catHousing,
      work: t.catWork,
    };
    return map[id] || id;
  };

  return (
    <div className="sidebar-section">
      <h2 className="sidebar-heading">{t.sidebarCategories}</h2>
      <ul className="sidebar-cat-list">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Link
              href={`/${lang}/articles?cat=${c.id}`}
              className={`sidebar-cat-item${activeCat === c.id ? " active" : ""}`}
              style={{ borderLeftColor: CAT_COLORS[c.id] }}
            >
              <span className="sidebar-cat-icon" aria-hidden="true">{c.icon}</span>
              <span className="sidebar-cat-name">{catLabel(c.id)}</span>
              <span className="sidebar-cat-count">{categoryCounts[c.id] ?? 0}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
