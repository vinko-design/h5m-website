export const SITE_NAME = "High Five Moments";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://highfivemoments.app";

/** Document `<title>` and meta description for search engines. */
export const SITE_TITLE =
  "High Five Moments | Shared goals and progress for couples";
export const SITE_DESCRIPTION =
  "A private app for couples to stay aligned, support each other's growth, track habits, goals, milestones, and celebrate progress together.";

/** Open Graph / Twitter card copy for social sharing. */
export const OG_TITLE =
  "High Five Moments — Built for the life you're building together";
export const OG_DESCRIPTION =
  "Track meaningful moments, shared goals, habits, milestones, and progress with your partner in one private space.";

export const OG_IMAGE_PATH = "/opengraph-image";
export const OG_IMAGE_ALT =
  "High Five Moments — Shared goals and progress for couples";
export const OG_IMAGE_SUBTITLE = "Shared goals and progress for couples";
export const OG_IMAGE_TAGLINE =
  "Stay aligned, build better habits, and celebrate wins together.";

export const PRIVACY_DESCRIPTION =
  "How High Five Moments collects, uses, and protects waitlist information.";

export const CONTACT_EMAIL = "hello@highfivemoments.app";
export const MAILING_ADDRESS =
  process.env.MAILING_ADDRESS ?? "High Five Moments";

export const FOUNDER_NAME = "Vinko Kraljevic";
export const FOUNDER_TITLE = "Founder, High Five Moments";
export const FOUNDER_X_URL = "https://x.com/buildwithvin";

export const SHOW_SOCIAL_PROOF = process.env.NODE_ENV === "development";
