import { DEFAULT_LANG, LANGUAGES, type Lang } from "@/lib/i18n";

const FALLBACK_SITE_URL = "https://life-in-aichi.vercel.app";

function ensureAbsoluteUrl(value: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export function getSiteUrl(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    FALLBACK_SITE_URL;

  try {
    return new URL(ensureAbsoluteUrl(raw));
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export function buildLanguageAlternates(
  pathBuilder: (lang: Lang) => string
): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const lang of LANGUAGES) {
    languages[lang] = pathBuilder(lang);
  }
  languages["x-default"] = pathBuilder(DEFAULT_LANG);

  return languages;
}
