export const LANGUAGES = ["en", "vi", "tl", "ja"] as const;
export type Lang = (typeof LANGUAGES)[number];
export const DEFAULT_LANG: Lang = "en";

export const LANG_META: Record<Lang, { label: string; flag: string; hreflang: string }> = {
  en: { label: "English", flag: "🇺🇸", hreflang: "en" },
  vi: { label: "Tiếng Việt", flag: "🇻🇳", hreflang: "vi" },
  tl: { label: "Filipino", flag: "🇵🇭", hreflang: "tl" },
  ja: { label: "日本語", flag: "🇯🇵", hreflang: "ja" },
};
