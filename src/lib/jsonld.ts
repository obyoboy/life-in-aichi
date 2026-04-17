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

export function generateFaqJsonLd(
  article: Article,
  t: Translations
): object {
  const faqs: { question: string; answer: string }[] = [
    {
      question: `${t.sec2} — ${article.title}`,
      answer: article.sections.s2 + (article.sections.s2note ? ` (${article.sections.s2note})` : ""),
    },
    {
      question: `${t.sec4} — ${article.title}`,
      answer: article.sections.s4.replace(/\n/g, " "),
    },
    {
      question: `${t.sec3} — ${article.title}`,
      answer: article.sections.s3,
    },
    {
      question: `${t.sec5} — ${article.title}`,
      answer: article.sections.s5.replace(/\n/g, " "),
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
