import type { Metadata } from "next";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getArticles } from "@/data/articles";
import { ArticleListClient } from "@/components/ArticleListClient";
import { buildLanguageAlternates } from "@/lib/seo";
import { assertArticleDataIntegrity } from "@/lib/articleDataValidation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGUAGES.includes(lang as Lang)) return {};

  const typedLang = lang as Lang;
  const t = getTranslations(typedLang);
  const pageTitle = `${t.allArticles} — ${t.siteTitle}`;

  return {
    title: pageTitle,
    description: t.tagline,
    alternates: {
      canonical: `/${typedLang}/articles`,
      languages: buildLanguageAlternates((targetLang) => `/${targetLang}/articles`),
    },
    openGraph: {
      title: pageTitle,
      description: t.tagline,
      url: `/${typedLang}/articles`,
      type: "website",
    },
  };
}

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { lang } = await params;
  const typedLang = lang as Lang;
  const { cat, q } = await searchParams;
  assertArticleDataIntegrity();
  const t = getTranslations(typedLang);
  const articles = getArticles(typedLang);

  return (
    <ArticleListClient
      lang={typedLang}
      t={t}
      articles={articles}
      initialCat={cat || null}
      initialQuery={q || ""}
    />
  );
}
