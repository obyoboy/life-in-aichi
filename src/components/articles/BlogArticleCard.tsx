import Image from "next/image";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article } from "@/data/articles";
import { CATEGORIES, CAT_COLORS } from "@/data/articles";
import { ReadMoreButton } from "@/components/ui/ReadMoreButton";

export function BlogArticleCard({
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
    <div className="blog-card">
      <div className="blog-card-image-wrap">
        {hasImage ? (
          <Image
            src={`/images/articles/${article.id}.png`}
            alt={article.title}
            width={400}
            height={225}
            className="blog-card-image"
          />
        ) : (
          <div
            className="blog-card-fallback"
            style={{ background: catColor + "22" }}
            aria-hidden="true"
          >
            <span className="blog-card-fallback-icon">{catIcon}</span>
          </div>
        )}
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span
            className="cat-badge"
            style={{ background: catColor + "22", color: catColor }}
          >
            <span aria-hidden="true">{catIcon}</span> {catLabel}
          </span>
          <span className="blog-card-date">{article.sections.s9}</span>
        </div>
        <h3 className="blog-card-title">{article.title}</h3>
        <p className="blog-card-summary">{article.summary}</p>
        <ReadMoreButton href={`/${lang}/articles/${article.id}`} label={t.readMore} />
      </div>
    </div>
  );
}
