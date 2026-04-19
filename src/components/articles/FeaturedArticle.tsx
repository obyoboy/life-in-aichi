import Image from "next/image";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article } from "@/data/articles";
import { CATEGORIES, CAT_COLORS } from "@/data/articles";
import { ReadMoreButton } from "@/components/ui/ReadMoreButton";

export function FeaturedArticle({
  article,
  lang,
  t,
  hasImage,
}: {
  article: Article;
  lang: Lang;
  t: Translations;
  hasImage: boolean;
}) {
  const catColor = CAT_COLORS[article.cat];
  const catIcon = CATEGORIES.find((c) => c.id === article.cat)?.icon;
  const catLabel = {
    childcare: t.catChildcare,
    medical: t.catMedical,
    housing: t.catHousing,
    work: t.catWork,
  }[article.cat] ?? article.cat;

  return (
    <div className="featured-article">
      <div className="featured-article-image-wrap">
        {hasImage ? (
          <Image
            src={`/images/articles/${article.id}.png`}
            alt={article.title}
            width={800}
            height={450}
            className="featured-article-image"
            priority
          />
        ) : (
          <div
            className="featured-article-fallback"
            style={{ background: catColor + "22" }}
            aria-hidden="true"
          >
            <span className="featured-article-fallback-icon">{catIcon}</span>
          </div>
        )}
      </div>
      <div className="featured-article-body">
        <div className="featured-article-meta">
          <span
            className="cat-badge"
            style={{ background: catColor + "22", color: catColor }}
          >
            <span aria-hidden="true">{catIcon}</span> {catLabel}
          </span>
          <span className="featured-article-date">{article.sections.s9}</span>
        </div>
        <h2 className="featured-article-title">{article.title}</h2>
        <p className="featured-article-summary">{article.summary}</p>
        <ReadMoreButton href={`/${lang}/articles/${article.id}`} label={t.readMore} />
      </div>
    </div>
  );
}
