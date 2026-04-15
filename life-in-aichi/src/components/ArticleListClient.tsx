"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import type { Article, Category } from "@/data/articles";
import { CATEGORIES, CAT_COLORS } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { LineCTA } from "@/components/LineCTA";
import Link from "next/link";

const isCategoryId = (value: string | null): value is Category =>
  !!value && CATEGORIES.some((category) => category.id === value);

export function ArticleListClient({
  lang,
  t,
  articles,
  initialCat,
  initialQuery,
}: {
  lang: Lang;
  t: Translations;
  articles: Article[];
  initialCat: string | null;
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCat, setSelectedCat] = useState<Category | null>(
    isCategoryId(initialCat) ? initialCat : null
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Debounced URL sync — state drives URL, not the reverse
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedCat) params.set("cat", selectedCat);
      const trimmed = searchQuery.trim();
      if (trimmed) params.set("q", trimmed);

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [selectedCat, searchQuery, pathname, router]);

  const catLabel = useCallback(
    (id: string) => {
      const map: Record<string, string> = {
        childcare: t.catChildcare,
        medical: t.catMedical,
        housing: t.catHousing,
        work: t.catWork,
      };
      return map[id] || id;
    },
    [t]
  );

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = articles.filter((a) => {
    const matchCat = !selectedCat || a.cat === selectedCat;
    const matchSearch =
      !normalizedSearch || a.title.toLowerCase().includes(normalizedSearch);
    return matchCat && matchSearch;
  });

  return (
    <div className="section">
      <Link href={`/${lang}`} className="back-btn">
        {t.backToHome}
      </Link>

      <h2 className="section-title">
        {selectedCat ? catLabel(selectedCat) : t.allArticles}
      </h2>

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="search"
          className="search-input"
          placeholder={t.search}
          aria-label={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter pills */}
      <div className="filter-row">
        <button
          type="button"
          className={`filter-pill ${!selectedCat ? "active" : ""}`}
          onClick={() => setSelectedCat(null)}
        >
          {t.filterAll}
        </button>
        {CATEGORIES.map((c) => (
          <button
            type="button"
            key={c.id}
            className={`filter-pill ${selectedCat === c.id ? "active" : ""}`}
            style={
              selectedCat === c.id
                ? { background: CAT_COLORS[c.id], borderColor: "transparent", color: "#fff" }
                : undefined
            }
            onClick={() => setSelectedCat(selectedCat === c.id ? null : c.id)}
          >
            {c.icon} {catLabel(c.id)}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="article-list">
        {filtered.length === 0 && <div className="empty-state">{t.noResults}</div>}
        {filtered.map((a) => (
          <ArticleCard key={a.id} article={a} lang={lang} t={t} catLabel={catLabel} />
        ))}
      </div>

      <LineCTA t={t} />
    </div>
  );
}
