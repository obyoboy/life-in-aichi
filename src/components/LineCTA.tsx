import type { Translations } from "@/lib/translations";

export function LineCTA({ t }: { t: Translations }) {
  return (
    <div className="line-cta">
      <div className="line-icon">💬</div>
      <div className="line-text">{t.ctaLine}</div>
      <button type="button" className="line-btn">
        {t.ctaLineBtn}
      </button>
    </div>
  );
}
