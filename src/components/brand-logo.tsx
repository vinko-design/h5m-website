import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/site-config";

import { LogoMark } from "./logo-mark";

const sizes = {
  hero: {
    icon: 72,
    text: "text-2xl sm:text-3xl md:text-4xl",
    gap: "gap-3 sm:gap-4",
  },
  header: {
    icon: 36,
    iconMobile: 40,
    text: "text-xl leading-[1.12] md:text-xl md:leading-normal",
    gap: "gap-2.5",
  },
  footer: {
    icon: 40,
    text: "text-xl",
    gap: "gap-3",
  },
} as const;

type BrandLogoProps = {
  size?: keyof typeof sizes;
  className?: string;
  showText?: boolean;
};

export function BrandLogo({
  size = "hero",
  className,
  showText = true,
}: BrandLogoProps) {
  const config = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center",
        config.gap,
        className,
      )}
    >
      {"iconMobile" in config && config.iconMobile ? (
        <>
          <LogoMark size={config.iconMobile} className="md:hidden" />
          <LogoMark size={config.icon} className="hidden md:block" />
        </>
      ) : (
        <LogoMark size={config.icon} />
      )}
      {showText ? (
        <span
          className={cn(
            "font-extrabold tracking-tight text-[var(--indigo)]",
            config.text,
          )}
        >
          {SITE_NAME}
        </span>
      ) : null}
    </span>
  );
}
