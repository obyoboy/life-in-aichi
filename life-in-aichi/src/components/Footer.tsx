import type { Translations } from "@/lib/translations";

export function Footer({ t }: { t: Translations }) {
  return (
    <footer className="site-footer">
      <div className="footer-disclaimer">{t.footerDisclaimer}</div>
      <div className="footer-copy">{t.footerCopy}</div>
    </footer>
  );
}
