import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site-config";

export const alt = `${SITE_NAME} — A couples app for shared goals`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1E293B 0%, #4F46E5 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 120,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "#F59E0B",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#FAFAF9",
            letterSpacing: "-0.02em",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#F59E0B",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          Shared goals for couples
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            color: "#FAFAF9",
            opacity: 0.7,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          Plan, track, and build your future together
        </div>
      </div>
    ),
    { ...size },
  );
}
