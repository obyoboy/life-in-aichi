import { ImageResponse } from "next/og";
import { getArticleById, CAT_COLORS, CATEGORIES } from "@/data/articles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({
  params,
}: {
  params: { lang: string; id: string };
}) {
  // Always use English article to ensure Latin characters render without custom fonts
  const article = getArticleById("en", params.id);

  if (!article) {
    return new ImageResponse(
      <div
        style={{
          background: "#1a1a2e",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#fff", fontSize: 48, fontWeight: 900 }}>
          Life in Aichi
        </div>
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const catColor = CAT_COLORS[article.cat];
  const catIcon = CATEGORIES.find((c) => c.id === article.cat)?.icon ?? "";

  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #2d2b55 50%, #3b3486 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "60px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 80,
          height: 6,
          background: catColor,
          borderRadius: 3,
          marginBottom: 36,
        }}
      />

      {/* Category badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            background: catColor + "33",
            color: catColor,
            padding: "6px 18px",
            borderRadius: 8,
            fontSize: 20,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{catIcon}</span>
          <span>{article.cat}</span>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: article.title.length > 60 ? 36 : 44,
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1.2,
          marginBottom: 20,
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {article.title}
      </div>

      {/* Summary */}
      <div
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.75)",
          marginBottom: 40,
        }}
      >
        {article.summary}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }}>
          life-in-aichi.vercel.app
        </div>
        <div
          style={{
            background: catColor,
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            padding: "10px 24px",
            borderRadius: 8,
          }}
        >
          Life in Aichi
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
