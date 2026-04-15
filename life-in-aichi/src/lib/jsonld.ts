import type { Article } from "@/data/articles";
import type { Lang } from "@/lib/i18n";
import type { Translations } from "@/lib/translations";
import { getSiteUrl } from "@/lib/seo";

export function generateArticleJsonLd(
  article: Article,
  lang: Lang,
  t: Translations
): object {
  const base = getSiteUrl().origin;
  const url = `${base}/${lang}/articles/${article.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.sections.s1,
    url,
    dateModified: article.sections.s9,
    inLanguage: lang,
    publisher: {
      "@type": "Organization",
      name: "Life in Aichi",
      url: base,
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
