"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article } from "@/data/articles";
import { BlogArticleCard } from "@/components/articles/BlogArticleCard";
import { FeaturedArticle } from "@/components/articles/FeaturedArticle";

type SortMode = "latest" | "popular";

export function BlogArticleGrid({
  lang,
  t,
  articles,
  imageSet,
}: {
  lang: Lang;
  t: Translations;
  articles: Article[];
  imageSet: string[];
}) {
  const [sort, setSort] = useState<SortMode>("latest");
  const imageIds = new Set(imageSet);

  const sorted = [...articles].sort((a, b) => {
    if (sort === "latest") return b.sections.s9.localeCompare(a.sections.s9);
    const rank = (badge: string | null) =>
      badge === "popular" ? 0 : badge === "new" ? 1 : 2;
    return rank(a.badge) - rank(b.badge);
  });

  const featured = sorted[0];
  const rest = sorted.slice(1);

  if (!featured) return null;

  return (
    <div>
      <FeaturedArticle
        article={featured}
        lang={lang}
        t={t}
        hasImage={imageIds.has(featured.id)}
      />
      <div className="sort-row" style={{ marginTop: "1.5rem" }}>
        <button
          type="button"
          className={`sort-pill ${sort === "latest" ? "active" : ""}`}
          onClick={() => setSort("latest")}
        >
          {t.sortLatest}
        </button>
        <button
          type="button"
          className={`sort-pill ${sort === "popular" ? "active" : ""}`}
          onClick={() => setSort("popular")}
        >
          {t.sortPopular}
        </button>
      </div>
      <div className="article-grid">
        {rest.map((a) => (
          <BlogArticleCard
            key={a.id}
            article={a}
            lang={lang}
            t={t}
            hasImage={imageIds.has(a.id)}
          />
        ))}
      </div>
    </div>
  );
}
