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
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Article data validation failed (${errors.length} issue(s)):\n${errors.join("\n")}`
    );
  }

  validated = true;
}
