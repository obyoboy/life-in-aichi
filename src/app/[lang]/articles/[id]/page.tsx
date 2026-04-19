import { notFound } from "next/navigation";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getArticleById, getArticles, CATEGORIES, CAT_COLORS, CTA_MAP } from "@/data/articles";
import { LineCTA } from "@/components/LineCTA";
import { ArticleCard } from "@/components/ArticleCard";
import { TableOfContents } from "@/components/TableOfContents";
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

const LOCALE_MAP: Record<Lang, string> = {
  en: "en_US",
  vi: "vi_VN",
  tl: "tl_PH",
  ja: "ja_JP",
};

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
  const pageTitle = article.sections.metaTitle || article.title;
  const pageDescription = article.sections.metaDescription || article.sections.intro || article.sections.s1;
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
      locale: LOCALE_MAP[typedLang],
      siteName: "Life in Aichi",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

function SectionBlock({
  id,
  num,
  title,
  accent,
  children,
}: {
  id: string;
  num: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="section-block">
      <div className="section-block-header">
        <span className="section-num" style={{ background: accent }} aria-hidden="true">
          {num}
        </span>
        <h2>{title}</h2>
      </div>
      <div className="section-block-body">{children}</div>
    </div>
  );
}

function StructuredSection({
  id,
  title,
  body,
  bullets,
  note,
  subsections,
}: {
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
  note?: string;
  subsections?: { h3: string; body: string }[];
}) {
  return (
    <section id={id} className="content-section">
      <h2 className="section-title">{title}</h2>
      {body && <p className="body-text">{body}</p>}

      {bullets && bullets.length > 0 && (
        <ul className="content-bullets">
          {bullets.map((bullet, index) => (
            <li key={`${index}-${bullet}`}>{bullet}</li>
          ))}
        </ul>
      )}

      {subsections && subsections.length > 0 && (
        <div className="content-subsection-list">
          {subsections.map((subsection, index) => (
            <div className="content-subsection" key={`${index}-${subsection.h3}`}>
              <h3>{subsection.h3}</h3>
              <p className="body-text">{subsection.body}</p>
            </div>
          ))}
        </div>
      )}

      {note && <p className="content-note">※ {note}</p>}
    </section>
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
  const intro = s.intro;
  const contentSections = (s.contentSections || []).filter((section) => section.h2.trim());
  const hasStructuredContent = contentSections.length > 0;
  const faqItems = (s.faq || []).filter((item) => item.question.trim() && item.answer.trim());
  const relatedArticles = getArticles(typedLang)
    .filter((a) => a.cat === article.cat && a.id !== article.id)
    .slice(0, 3);

  const faqHeadingByLang: Record<Lang, string> = {
    en: "Frequently asked questions",
    vi: "Câu hỏi thường gặp",
    tl: "Madalas itanong",
    ja: "よくある質問",
  };
  const relatedHeadingByLang: Record<Lang, string> = {
    en: "Related articles",
    vi: "Bài viết liên quan",
    tl: "Mga kaugnay na artikulo",
    ja: "関連記事",
  };
  const tocLabelByLang: Record<Lang, string> = {
    en: "Table of Contents",
    vi: "Mục lục",
    tl: "Talaan ng Nilalaman",
    ja: "目次",
  };

  // Build TOC items
  const tocItems = hasStructuredContent
    ? contentSections.map((section, i) => ({ id: `section-${i}`, label: section.h2 }))
    : [
        { id: "sec-1", label: t.sec1 },
        { id: "sec-3", label: t.sec3 },
        { id: "sec-4", label: t.sec4 },
        { id: "sec-5", label: t.sec5 },
        { id: "sec-6", label: t.sec6 },
        { id: "sec-7", label: t.sec7 },
      ];

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

      <article>
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
            <span aria-hidden="true">{catObj?.icon}</span> {catLabel(article.cat)}
          </span>
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span>
              {t.regionLabel}: {article.region}
            </span>
            <span className="verified-date">
              <span aria-hidden="true">✓</span> {t.sec9}: {s.s9}
            </span>
          </div>
        </div>

        {intro && (
          <div className="intro-box">
            <p className="intro-text">{intro}</p>
          </div>
        )}

        {/* Eligibility highlight */}
        <div className="eligibility-box">
          <div
            className="eligibility-icon"
            role="img"
            aria-label={t.sec2}
          >
            ✅
          </div>
          <div>
            <div className="eligibility-title">{t.sec2}</div>
            <div className="eligibility-text">{s.s2}</div>
            {s.s2note && (
              <div className="eligibility-note">
                <span aria-hidden="true">⚠️</span> {s.s2note}
              </div>
            )}
          </div>
        </div>

        {/* Table of contents */}
        <TableOfContents items={tocItems} tocLabel={tocLabelByLang[typedLang]} />

        {hasStructuredContent ? (
          <div className="content-section-wrap">
            {contentSections.map((section, index) => (
              <StructuredSection
                key={`${index}-${section.h2}`}
                id={`section-${index}`}
                title={section.h2}
                body={section.body}
                bullets={section.bullets}
                note={section.note}
                subsections={section.subsections}
              />
            ))}
          </div>
        ) : (
          <>
            <SectionBlock id="sec-1" num="1" title={t.sec1} accent={catColor}>
              <p className="body-text">{s.s1}</p>
            </SectionBlock>

            <SectionBlock id="sec-3" num="3" title={t.sec3} accent={catColor}>
              <p className="body-text">{s.s3}</p>
            </SectionBlock>

            <SectionBlock id="sec-4" num="4" title={t.sec4} accent={catColor}>
              <pre className="amount-box">{s.s4}</pre>
            </SectionBlock>

            <SectionBlock id="sec-5" num="5" title={t.sec5} accent={catColor}>
              <p className="body-text">{s.s5}</p>
            </SectionBlock>

            <SectionBlock id="sec-6" num="6" title={t.sec6} accent={catColor}>
              <pre className="doc-list">{s.s6}</pre>
            </SectionBlock>

            <SectionBlock id="sec-7" num="7" title={t.sec7} accent={catColor}>
              <pre className="mistake-list">{s.s7}</pre>
            </SectionBlock>
          </>
        )}

        {/* Section 8: Official page */}
        <div className="official-box">
          <div className="official-label">{t.sec8}</div>
          <a href={s.s8} target="_blank" rel="noopener noreferrer" className="official-link">
            {s.s8}
          </a>
        </div>

        {/* Section 10: Help */}
        <div className="help-box">
          <div className="help-title">{t.sec10}</div>
          <pre className="help-text">{s.s10}</pre>
        </div>

        {/* FAQ accordion */}
        {faqItems.length > 0 && (
          <section className="faq-section" aria-labelledby="faq-heading">
            <h2 className="section-title" id="faq-heading">
              {faqHeadingByLang[typedLang]}
            </h2>
            <div className="faq-list">
              {faqItems.map((faq, index) => (
                <details className="faq-item" key={`${index}-${faq.question}`}>
                  <summary className="faq-summary">{faq.question}</summary>
                  <div className="faq-answer-body">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <aside className="related-section">
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
        </aside>
      )}

      {/* Contextual CTA — moved after related articles, labeled as PR */}
      {cta && (
        <div className="cta-wrapper">
          <span className="cta-pr-label">PR</span>
          <div className="cta-box" style={{ borderColor: cta.color }}>
            <div className="cta-text">{(t as Record<string, string>)[cta.key]}</div>
            <button type="button" className="cta-btn" style={{ background: cta.color }}>
              {(t as Record<string, string>)[cta.btnKey]}
            </button>
          </div>
        </div>
      )}

      <LineCTA t={t} />
    </div>
  );
}
