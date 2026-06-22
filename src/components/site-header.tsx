"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BrandLogo } from "./brand-logo";

const WAITLIST_SECTION_ID = "waitlist";
const WAITLIST_EMAIL_INPUT_ID = "cta-waitlist-email";

function scrollToWaitlistSection() {
  const target = document.getElementById(WAITLIST_SECTION_ID);
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    document.getElementById(WAITLIST_EMAIL_INPUT_ID)?.focus({ preventScroll: true });
  }, 400);
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showWaitlistCta = pathname !== "/thank-you";
  const [visible, setVisible] = useState(!isHome);

  const handleWaitlistClick = useCallback(() => {
    scrollToWaitlistSection();
  }, []);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }

    const sentinel = document.getElementById("hero-brand-sentinel");
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!isHome || window.location.hash !== `#${WAITLIST_SECTION_ID}`) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToWaitlistSection();
    });
  }, [isHome]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-[var(--off-white)]/90 backdrop-blur-md transition-[transform,opacity] duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="rounded-md outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--indigo)]"
          aria-label="High Five Moments home"
        >
          <BrandLogo size="header" />
        </Link>

        {showWaitlistCta ? (
          isHome ? (
            <Button
              type="button"
              onClick={handleWaitlistClick}
              className="h-9 shrink-0 rounded-xl bg-[var(--indigo)] px-4 text-sm font-semibold text-white hover:bg-[var(--indigo)]/90"
            >
              Join the waitlist
            </Button>
          ) : (
            <Button
              asChild
              className="h-9 shrink-0 rounded-xl bg-[var(--indigo)] px-4 text-sm font-semibold text-white hover:bg-[var(--indigo)]/90"
            >
              <Link href={`/#${WAITLIST_SECTION_ID}`}>Join the waitlist</Link>
            </Button>
          )
        ) : null}
      </div>
    </header>
  );
}
