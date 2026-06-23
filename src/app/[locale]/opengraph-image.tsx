import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/config";

export const alt = "RENU — 鞋包精緻護理";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline =
    isLocale(locale) && locale === "en"
      ? "Premium Shoe & Bag Care"
      : "鞋包精緻護理 · 讓珍藏煥然如新";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background:
            "radial-gradient(circle at 25% 15%, #1c1710, #0b0b0d 60%)",
          color: "#eceae6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "30px",
            letterSpacing: "10px",
            textTransform: "uppercase",
            color: "#c8a86a",
          }}
        >
          <div style={{ width: "56px", height: "2px", background: "#c8a86a" }} />
          RENU
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "40px",
            fontSize: "120px",
            fontWeight: 600,
            letterSpacing: "16px",
            color: "#eceae6",
          }}
        >
          RENU
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "40px",
            color: "#9a958c",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
