import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { SITE_NAME } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        <Link
          href="/"
          className="rounded-md outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--indigo)]"
          aria-label="High Five Moments home"
        >
          <BrandLogo size="footer" />
        </Link>

        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {year} {SITE_NAME}. highfivemoments.app
        </p>
        <nav aria-label="Footer">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground underline-offset-2 hover:text-[var(--navy)] hover:underline"
          >
            Privacy policy
          </Link>
        </nav>
        </div>
      </div>
    </footer>
  );
}
