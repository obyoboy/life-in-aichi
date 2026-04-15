"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";

type SortMode = "latest" | "popular";

function makeCatLabel(t: Translations) {
  return (id: string) => {
    const map: Record<string, string> = {
      childcare: t.catChildcare,
      medical: t.catMedical,
      housing: t.catHousing,
      work: t.catWork,
    };
    return map[id] || id;
  };
}

export function SortableArticleList({
  lang,
  t,
  articles,
}: {
  lang: Lang;
  t: Translations;
  articles: Article[];
}) {
  const [sort, setSort] = useState<SortMode>("latest");
  const catLabel = makeCatLabel(t);

  const sorted = [...articles].sort((a, b) => {
    if (sort === "latest") {
      return b.sections.s9.localeCompare(a.sections.s9);
    }
    const rank = (badge: string | null) =>
      badge === "popular" ? 0 : badge === "new" ? 1 : 2;
    return rank(a.badge) - rank(b.badge);
  });

  return (
    <div>
      <div className="sort-row">
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
      <div className="article-list">
        {sorted.map((a) => (
          <ArticleCard key={a.id} article={a} lang={lang} t={t} catLabel={catLabel} />
        ))}
      </div>
    </div>
  );
}
