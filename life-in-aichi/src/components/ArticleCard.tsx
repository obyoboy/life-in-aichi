import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article } from "@/data/articles";
import { CATEGORIES, CAT_COLORS } from "@/data/articles";

export function ArticleCard({
  article,
  lang,
  t,
  catLabel,
}: {
  article: Article;
  lang: Lang;
  t: Translations;
  catLabel: (id: string) => string;
}) {
  const badgeLabel =
    article.badge === "new"
      ? t.newBadge
      : article.badge === "popular"
        ? t.popularBadge
        : null;
  const catColor = CAT_COLORS[article.cat];
  const catIcon = CATEGORIES.find((c) => c.id === article.cat)?.icon;

  return (
    <Link
      href={`/${lang}/articles/${article.id}`}
      className="article-card"
      aria-label={article.title}
    >
      <div className="article-card-accent" style={{ background: catColor }} />
      <div
        className="article-card-icon"
        style={{ background: catColor + "11" }}
      >
        {catIcon}
      </div>
      <div className="article-card-body">
        <div className="article-card-top">
          <span
            className="cat-badge"
            style={{ background: catColor + "22", color: catColor }}
          >
            {catIcon} {catLabel(article.cat)}
          </span>
          {badgeLabel && (
            <span
              className="badge"
              style={{
                background: article.badge === "new" ? "#E8836B" : "#D4A843",
              }}
            >
              {badgeLabel}
            </span>
          )}
          <span className="eligible-badge">{t.eligibleBadge}</span>
        </div>
        <h3>{article.title}</h3>
        <div className="article-card-summary">{article.summary}</div>
        <div className="article-card-meta">
          <span>
            {t.regionLabel}: {article.region}
          </span>
          <span>
            {t.sec9}: {article.sections.s9}
          </span>
        </div>
      </div>
      <div className="article-card-chevron">›</div>
    </Link>
  );
}
