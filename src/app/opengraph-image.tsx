import { ImageResponse } from "next/og";

import {
  LOGO_COLORS,
  LOGO_PATHS,
  LOGO_VIEWBOX,
} from "@/lib/logo-paths";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_SUBTITLE,
  OG_IMAGE_TAGLINE,
  SITE_NAME,
} from "@/lib/site-config";

export const alt = OG_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const colors = LOGO_COLORS.standard;
  const logoHeight = 120;
  const logoWidth = (LOGO_VIEWBOX.width / LOGO_VIEWBOX.height) * logoHeight;

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
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <svg
            viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
            width={logoWidth}
            height={logoHeight}
            style={{ display: "block" }}
          >
            <path d={LOGO_PATHS.hand} fill={colors.hand} />
            <path d={LOGO_PATHS.heart} fill={colors.heart} />
          </svg>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#FAFAF9",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_NAME}
          </div>
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
          {OG_IMAGE_SUBTITLE}
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
          {OG_IMAGE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
