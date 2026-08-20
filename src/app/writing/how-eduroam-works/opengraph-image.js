import { ImageResponse } from "next/og";

export const alt = "How eduroam works";
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
        padding: "58px 66px",
        background: "#161411",
        color: "#e7e5e4",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "1px solid #44403c",
          color: "#a8a29e",
          fontSize: 19,
        }}
      >
        <strong style={{ color: "#e7e5e4" }}>mohammed elshrief</strong>
        <span>writing / networks</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            width: 610,
            fontSize: 82,
            lineHeight: 1,
            fontWeight: 650,
            letterSpacing: "-0.04em",
          }}
        >
          How eduroam works
        </div>
        <div
          style={{
            width: 390,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            padding: "28px 30px",
            borderTop: "1px solid #57534e",
            borderBottom: "1px solid #57534e",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#d6a85c", fontSize: 18 }}>visited campus</span>
            <span style={{ color: "#78716c", fontSize: 15 }}>asks</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#c49a59" }} />
            <div style={{ width: 300, height: 1, background: "#78716c" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#c49a59" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#78716c", fontSize: 15 }}>answers</span>
            <span style={{ color: "#d6a85c", fontSize: 18 }}>home university</span>
          </div>
        </div>
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
        <span>what happens after I press connect</span>
        <span style={{ color: "#d6a85c" }}>5 minute read</span>
      </div>
    </div>,
    size
  );
}
