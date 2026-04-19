import "server-only";

import { getArticles } from "@/data/articles";
import { LANGUAGES } from "@/lib/i18n";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
let validated = false;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;
  return date.toISOString().slice(0, 10) === value;
}

export function assertArticleDataIntegrity(): void {
  if (validated) return;

  const errors: string[] = [];

  for (const lang of LANGUAGES) {
    for (const article of getArticles(lang)) {
      if (!isValidHttpUrl(article.sections.s8)) {
        errors.push(
          `[${lang}/${article.id}] sections.s8 must be a valid http(s) URL: "${article.sections.s8}"`
        );
      }

      if (!isValidDateString(article.sections.s9)) {
        errors.push(
          `[${lang}/${article.id}] sections.s9 must be YYYY-MM-DD: "${article.sections.s9}"`
        );
      }

      if (article.sections.faq) {
        article.sections.faq.forEach((faq, index) => {
          if (!faq.question.trim()) {
            errors.push(`[${lang}/${article.id}] sections.faq[${index}].question must not be empty`);
          }
          if (!faq.answer.trim()) {
            errors.push(`[${lang}/${article.id}] sections.faq[${index}].answer must not be empty`);
          }
        });
      }

      if (article.sections.contentSections) {
        article.sections.contentSections.forEach((section, sectionIndex) => {
          if (!section.h2.trim()) {
            errors.push(
              `[${lang}/${article.id}] sections.contentSections[${sectionIndex}].h2 must not be empty`
            );
          }

          const hasBody = Boolean(section.body?.trim());
          const hasBullets = Boolean(section.bullets?.length);
          const hasSubsections = Boolean(section.subsections?.length);

          if (!hasBody && !hasBullets && !hasSubsections) {
            errors.push(
              `[${lang}/${article.id}] sections.contentSections[${sectionIndex}] requires body, bullets, or subsections`
            );
          }

          section.subsections?.forEach((subsection, subIndex) => {
            if (!subsection.h3.trim()) {
              errors.push(
                `[${lang}/${article.id}] sections.contentSections[${sectionIndex}].subsections[${subIndex}].h3 must not be empty`
              );
            }
            if (!subsection.body.trim()) {
              errors.push(
                `[${lang}/${article.id}] sections.contentSections[${sectionIndex}].subsections[${subIndex}].body must not be empty`
              );
            }
          });
        });
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Article data validation failed (${errors.length} issue(s)):\n${errors.join("\n")}`
    );
  }

  validated = true;
}
