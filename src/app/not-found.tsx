import Link from "next/link";
import { LANGUAGES, LANG_META } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#1a1a2e" }}>
        Page not found
      </h1>
      <p style={{ fontSize: 15, color: "#666", marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved.
        <br />
        お探しのページは見つかりませんでした。
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {LANGUAGES.map((lang) => (
          <Link
            key={lang}
            href={`/${lang}`}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              background: "#1a1a2e",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            {LANG_META[lang].flag} {LANG_META[lang].label}
          </Link>
        ))}
      </div>
    </div>
  );
}
