import Link from "next/link";
import type { Metadata } from "next";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getArticles, CATEGORIES, CAT_COLORS } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { SortableArticleList } from "@/components/SortableArticleList";
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
      {/* Hero */}
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

      {/* Categories */}
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

      {/* All Articles */}
      <div className="section">
        <h2 className="section-title">{t.allArticles}</h2>
        <SortableArticleList lang={typedLang} t={t} articles={articles} />
      </div>

      {/* LINE CTA */}
      <div className="section">
        <LineCTA t={t} />
      </div>
    </>
  );
}
