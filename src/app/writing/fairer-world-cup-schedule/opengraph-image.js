import { ImageResponse } from "next/og";

export const alt = "Can a World Cup schedule be fairer without making anyone worse off?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "58px 68px",
        background: "#0c0a09",
        color: "#f5f5f4",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "1px solid #44403c",
          fontSize: 20,
        }}
      >
        <strong>mohammed elshrief</strong>
        <span style={{ color: "#a8a29e" }}>writing / operations research</span>
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: 940,
          fontSize: 72,
          lineHeight: 1.02,
          fontWeight: 650,
          letterSpacing: "-0.045em",
        }}
      >
        Can a World Cup schedule be fairer without making anyone worse off?
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 18,
          borderTop: "1px solid #44403c",
          color: "#a8a29e",
          fontSize: 18,
        }}
      >
        <span>two models, one conditional recommendation</span>
        <span style={{ color: "#fbbf24" }}>no team worse off</span>
      </div>
    </div>,
    size
  );
}
