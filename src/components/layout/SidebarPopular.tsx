import Link from "next/link";
import Image from "next/image";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article } from "@/data/articles";
import { CATEGORIES } from "@/data/articles";

export function SidebarPopular({
  lang,
  t,
  articles,
  imageSet,
}: {
  lang: Lang;
  t: Translations;
  articles: Article[];
  imageSet: Set<string>;
}) {
  const popularArticles = articles
    .filter((a) => a.badge === "popular")
    .slice(0, 5);

  if (popularArticles.length === 0) return null;

  return (
    <div className="sidebar-section">
      <h2 className="sidebar-heading">{t.sidebarPopular}</h2>
      <ul className="sidebar-popular-list">
        {popularArticles.map((article) => {
          const hasImage = imageSet.has(article.id);
          const catIcon = CATEGORIES.find((c) => c.id === article.cat)?.icon;
          return (
            <li key={article.id}>
              <Link
                href={`/${lang}/articles/${article.id}`}
                className="sidebar-popular-item"
              >
                <div className="sidebar-popular-thumb">
                  {hasImage ? (
                    <Image
                      src={`/images/articles/${article.id}.png`}
                      alt={article.title}
                      width={60}
                      height={60}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="sidebar-popular-emoji" aria-hidden="true">
                      {catIcon}
                    </span>
                  )}
                </div>
                <div className="sidebar-popular-text">
                  <p className="sidebar-popular-title">{article.title}</p>
                  <p className="sidebar-popular-desc">{article.summary}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
