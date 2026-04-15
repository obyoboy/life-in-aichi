import type { MetadataRoute } from "next";
import { LANGUAGES, DEFAULT_LANG, type Lang } from "@/lib/i18n";
import { getArticles } from "@/data/articles";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().origin;
  const now = new Date();
  const articles = getArticles("en");

  const entries: MetadataRoute.Sitemap = [];

  /* ── Home pages (per language) ── */
  for (const lang of LANGUAGES) {
    const languages: Record<string, string> = {};
    for (const l of LANGUAGES) {
      languages[l] = `${base}/${l}`;
    }
    languages["x-default"] = `${base}/${DEFAULT_LANG}`;

    entries.push({
      url: `${base}/${lang}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: lang === DEFAULT_LANG ? 1.0 : 0.9,
      alternates: { languages },
    });
  }

  /* ── Article list pages (per language) ── */
  for (const lang of LANGUAGES) {
    const languages: Record<string, string> = {};
    for (const l of LANGUAGES) {
      languages[l] = `${base}/${l}/articles`;
    }
    languages["x-default"] = `${base}/${DEFAULT_LANG}/articles`;

    entries.push({
      url: `${base}/${lang}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages },
    });
  }

  /* ── Individual article pages (per language × article) ── */
  for (const article of articles) {
    for (const lang of LANGUAGES) {
      const languages: Record<string, string> = {};
      for (const l of LANGUAGES) {
        languages[l] = `${base}/${l}/articles/${article.id}`;
      }
      languages["x-default"] = `${base}/${DEFAULT_LANG}/articles/${article.id}`;

      entries.push({
        url: `${base}/${lang}/articles/${article.id}`,
        lastModified: article.sections.s9 ? new Date(article.sections.s9) : now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
