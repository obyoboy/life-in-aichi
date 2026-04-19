import { existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getArticles, CATEGORIES, CAT_COLORS } from "@/data/articles";
import { BlogArticleGrid } from "@/components/articles/BlogArticleGrid";
import { SidebarCategories } from "@/components/layout/SidebarCategories";
import { SidebarPopular } from "@/components/layout/SidebarPopular";
import { SidebarArchive } from "@/components/layout/SidebarArchive";
import { LineCTA } from "@/components/LineCTA";
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
  const pageTitle = `${t.siteTitle} — ${t.siteSubtitle}`;

  return {
    title: pageTitle,
    description: t.tagline,
    alternates: {
      canonical: `/${typedLang}`,
      languages: buildLanguageAlternates((targetLang) => `/${targetLang}`),
    },
    openGraph: {
      title: pageTitle,
      description: t.tagline,
      url: `/${typedLang}`,
      type: "website",
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang as Lang;
  assertArticleDataIntegrity();
  const t = getTranslations(typedLang);
  const articles = getArticles(typedLang);

  const imageDir = join(process.cwd(), "public", "images", "articles");
  const imageSet = articles
    .filter((a) => existsSync(join(imageDir, `${a.id}.png`)))
    .map((a) => a.id);

  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat.id] = articles.filter((a) => a.cat === cat.id).length;
  }

  const catLabel = (id: string) => {
    const map: Record<string, string> = {
      childcare: t.catChildcare,
      medical: t.catMedical,
      housing: t.catHousing,
      work: t.catWork,
    };
    return map[id] || id;
  };

  return (
    <>
      {/* Hero — 変更なし */}
      <div className="hero">
        <div className="hero-pattern" />
        <div className="hero-content">
          <h1>{t.siteTitle}</h1>
          <p>{t.tagline}</p>
          <Link href={`/${typedLang}/articles`} className="hero-btn">
            {t.heroBtn}
          </Link>
        </div>
      </div>

      {/* Categories — 変更なし */}
      <div className="section">
        <h2 className="section-title">{t.categories}</h2>
        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const count = articles.filter((a) => a.cat === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/${typedLang}/articles?cat=${c.id}`}
                className="cat-card"
                style={{ borderLeftColor: CAT_COLORS[c.id] }}
              >
                <div className="cat-icon">{c.icon}</div>
                <div className="cat-name">{catLabel(c.id)}</div>
                <div className="cat-count">
                  {count} {t.articleCount}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2カラムレイアウト — カテゴリ以下 */}
      <div className="main-layout">
        <div className="main-content">
          <BlogArticleGrid
            lang={typedLang}
            t={t}
            articles={articles}
            imageSet={imageSet}
          />
        </div>

        <aside className="sidebar">
          <SidebarCategories
            lang={typedLang}
            t={t}
            categoryCounts={categoryCounts}
          />
          <SidebarPopular
            lang={typedLang}
            t={t}
            articles={articles}
            imageSet={new Set(imageSet)}
          />
          <SidebarArchive lang={typedLang} t={t} articles={articles} />
        </aside>
      </div>

      <div className="section" style={{ maxWidth: "1200px", paddingTop: 0 }}>
        <LineCTA t={t} />
      </div>
    </>
  );
}
