import { notFound } from "next/navigation";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getArticleById, getArticles, CATEGORIES, CAT_COLORS, CTA_MAP } from "@/data/articles";
import { LineCTA } from "@/components/LineCTA";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";
import { buildLanguageAlternates, getSiteUrl } from "@/lib/seo";
import { assertArticleDataIntegrity } from "@/lib/articleDataValidation";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  assertArticleDataIntegrity();
  const allArticles = getArticles("en");
  const params: { lang: string; id: string }[] = [];
  for (const lang of LANGUAGES) {
    for (const article of allArticles) {
      params.push({ lang, id: article.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  assertArticleDataIntegrity();
  const article = getArticleById(lang as Lang, id);
  if (!article) return {};
  const typedLang = lang as Lang;
  const pageTitle = article.title;
  const pageDescription = article.sections.s1;
  const canonicalPath = `/${typedLang}/articles/${id}`;
  const hreflangMap = buildLanguageAlternates((targetLang) => `/${targetLang}/articles/${id}`);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalPath,
      languages: hreflangMap,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalPath,
      type: "article",
    },
  };
}

function SectionBlock({
  num,
  title,
  accent,
  children,
}: {
  num: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-block">
      <div className="section-block-header">
        <span className="section-num" style={{ background: accent }}>
          {num}
        </span>
        <h3>{title}</h3>
      </div>
      <div className="section-block-body">{children}</div>
    </div>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  assertArticleDataIntegrity();
  const t = getTranslations(lang as Lang);
  const article = getArticleById(lang as Lang, id);

  if (!article) notFound();

  const s = article.sections;
  const catColor = CAT_COLORS[article.cat];
  const cta = CTA_MAP[article.cat];
  const catObj = CATEGORIES.find((c) => c.id === article.cat);

  const catLabel = (cid: string) => {
    const map: Record<string, string> = {
      childcare: t.catChildcare,
      medical: t.catMedical,
      housing: t.catHousing,
      work: t.catWork,
    };
    return map[cid] || cid;
  };

  const typedLang = lang as Lang;
  const base = getSiteUrl().origin;
  const relatedArticles = getArticles(typedLang)
    .filter((a) => a.cat === article.cat && a.id !== article.id)
    .slice(0, 3);
  const relatedHeadingByLang: Record<Lang, string> = {
    en: "Related articles",
    vi: "Bai viet lien quan",
    tl: "Mga kaugnay na artikulo",
    ja: "関連記事",
  };

  const articleJsonLd = generateArticleJsonLd(article, typedLang, t);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: t.siteTitle, url: `${base}/${typedLang}` },
    { name: t.allArticles, url: `${base}/${typedLang}/articles` },
    { name: article.title, url: `${base}/${typedLang}/articles/${id}` },
  ]);
  const faqJsonLd = generateFaqJsonLd(article, t);

  return (
    <div className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Link href={`/${lang}/articles`} className="back-btn">
        {t.backToList}
      </Link>

      {/* Article header */}
      <div className="article-header" style={{ borderLeftColor: catColor }}>
        <span
          className="cat-badge"
          style={{
            background: catColor + "22",
            color: catColor,
            marginBottom: 8,
            display: "inline-block",
          }}
        >
          {catObj?.icon} {catLabel(article.cat)}
        </span>
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span>
            {t.regionLabel}: {article.region}
          </span>
          <span className="verified-date">
            ✓ {t.sec9}: {s.s9}
          </span>
        </div>
      </div>

      {/* Eligibility highlight */}
      <div className="eligibility-box">
        <div className="eligibility-icon">✅</div>
        <div>
          <div className="eligibility-title">{t.sec2}</div>
          <div className="eligibility-text">{s.s2}</div>
          {s.s2note && <div className="eligibility-note">⚠️ {s.s2note}</div>}
        </div>
      </div>

      {/* Section 1: What is this? */}
      <SectionBlock num="1" title={t.sec1} accent={catColor}>
        <p className="body-text">{s.s1}</p>
      </SectionBlock>

      {/* Section 3: Who is eligible? */}
      <SectionBlock num="3" title={t.sec3} accent={catColor}>
        <p className="body-text">{s.s3}</p>
      </SectionBlock>

      {/* Section 4: How much? */}
      <SectionBlock num="4" title={t.sec4} accent={catColor}>
        <pre className="amount-box">{s.s4}</pre>
      </SectionBlock>

      {/* Section 5: Where to apply? */}
      <SectionBlock num="5" title={t.sec5} accent={catColor}>
        <p className="body-text">{s.s5}</p>
      </SectionBlock>

      {/* Section 6: Required documents */}
      <SectionBlock num="6" title={t.sec6} accent={catColor}>
        <pre className="doc-list">{s.s6}</pre>
      </SectionBlock>

      {/* Section 7: Common mistakes */}
      <SectionBlock num="7" title={t.sec7} accent={catColor}>
        <pre className="mistake-list">{s.s7}</pre>
      </SectionBlock>

      {/* Section 8: Official page */}
      <div className="official-box">
        <div className="official-label">{t.sec8}</div>
        <a href={s.s8} target="_blank" rel="noopener noreferrer" className="official-link">
          {s.s8}
        </a>
      </div>

      {/* Contextual CTA */}
      {cta && (
        <div className="cta-box" style={{ borderColor: cta.color }}>
          <div className="cta-text">{(t as Record<string, string>)[cta.key]}</div>
          <button type="button" className="cta-btn" style={{ background: cta.color }}>
            {(t as Record<string, string>)[cta.btnKey]}
          </button>
        </div>
      )}

      {/* Section 10: Help */}
      <div className="help-box">
        <div className="help-title">{t.sec10}</div>
        <pre className="help-text">{s.s10}</pre>
      </div>

      {relatedArticles.length > 0 && (
        <div className="related-section">
          <h2 className="section-title">{relatedHeadingByLang[typedLang]}</h2>
          <div className="article-list">
            {relatedArticles.map((related) => (
              <ArticleCard
                key={related.id}
                article={related}
                lang={typedLang}
                t={t}
                catLabel={catLabel}
              />
            ))}
          </div>
        </div>
      )}

      <LineCTA t={t} />
    </div>
  );
}
