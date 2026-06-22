import { LOGO_VIEWBOX } from "@/lib/logo-paths";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  /** Render height in pixels; width scales from the logo aspect ratio. */
  size?: number;
};

export function LogoMark({ className, size = 48 }: LogoMarkProps) {
  const width = Math.round((LOGO_VIEWBOX.width / LOGO_VIEWBOX.height) * size);

  return (
    // Plain img avoids Next.js lazy-loading skipping logos in hidden header / below-fold footer.
    <img
      src="/high-five-moments-logo.svg"
      alt=""
      width={width}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
      decoding="async"
    />
  );
}
