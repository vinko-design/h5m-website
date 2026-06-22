import { ImageResponse } from "next/og";

import {
  BRAND_GOLD,
  LOGO_COLORS,
  LOGO_PATHS,
  LOGO_VIEWBOX,
} from "@/lib/logo-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const colors = LOGO_COLORS.standard;
  const logoHeight = 132;
  const logoWidth = (LOGO_VIEWBOX.width / LOGO_VIEWBOX.height) * logoHeight;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_GOLD,
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
      </div>
    ),
    { ...size },
  );
}
