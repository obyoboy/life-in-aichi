import { existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getArticles, CATEGORIES } from "@/data/articles";
import { SidebarCategories } from "@/components/layout/SidebarCategories";
import { SidebarPopular } from "@/components/layout/SidebarPopular";
import { SidebarArchive } from "@/components/layout/SidebarArchive";
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

  const imageDir = join(process.cwd(), "public", "images", "articles");
  const imageSet = new Set(
    articles.filter((a) => existsSync(join(imageDir, `${a.id}.png`))).map((a) => a.id)
  );

  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat.id] = articles.filter((a) => a.cat === cat.id).length;
  }

  return (
    <div className="main-layout">
      <div className="main-content">
        <ArticleListClient
          lang={typedLang}
          t={t}
          articles={articles}
          imageSet={imageSet}
          initialCat={cat || null}
          initialQuery={q || ""}
        />
      </div>

      <aside className="sidebar">
        <SidebarCategories
          lang={typedLang}
          t={t}
          categoryCounts={categoryCounts}
          activeCat={cat}
        />
        <SidebarPopular
          lang={typedLang}
          t={t}
          articles={articles}
          imageSet={imageSet}
        />
        <SidebarArchive lang={typedLang} t={t} articles={articles} />
      </aside>
    </div>
  );
}
