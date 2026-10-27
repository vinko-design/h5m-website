"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { BLOG_TITLE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { BrandLogo } from "./brand-logo";

const WAITLIST_SECTION_ID = "waitlist";
const WAITLIST_EMAIL_INPUT_ID = "cta-waitlist-email";

type SiteHeaderClientProps = {
  showBlog: boolean;
};

function pageScrollsToWaitlist(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/blog/");
}

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

function NavLink({
  href,
  children,
  active,
  onNavigate,
  className,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-sm font-medium text-[var(--indigo)] underline-offset-2 transition-colors hover:text-[var(--indigo)]/80 hover:underline hover:underline-offset-2",
        active && "font-semibold underline underline-offset-[0.35em]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function SiteHeaderClient({ showBlog }: SiteHeaderClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrollsToWaitlist = pageScrollsToWaitlist(pathname);
  const showWaitlistCta = pathname !== "/thank-you";
  const [heroVisible, setHeroVisible] = useState(isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuPanelId = useId();

  const headerVisible = !isHome || !heroVisible;
  const isBlogActive = pathname === "/blog" || pathname.startsWith("/blog/");

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleWaitlistClick = useCallback(() => {
    closeMobileMenu();
    scrollToWaitlistSection();
  }, [closeMobileMenu]);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const sentinel = document.getElementById("hero-brand-sentinel");
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!scrollsToWaitlist || window.location.hash !== `#${WAITLIST_SECTION_ID}`) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToWaitlistSection();
    });
  }, [scrollsToWaitlist]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  const navLinks = (
    <>
      <NavLink href="/" active={isHome}>
        Home
      </NavLink>
      {showBlog ? (
        <NavLink href="/blog" active={isBlogActive}>
          {BLOG_TITLE}
        </NavLink>
      ) : null}
    </>
  );

  return (
    <>
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-[var(--off-white)]/65 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
        />
      ) : null}

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-[var(--off-white)]/90 backdrop-blur-md transition-[transform,opacity] duration-300",
          headerVisible || mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0",
          mobileMenuOpen && "pointer-events-auto",
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

          <div className="flex shrink-0 items-center gap-2">
            <nav
              aria-label="Main"
              className="hidden items-center gap-6 md:mr-10 md:flex"
            >
              {navLinks}
            </nav>

            {showWaitlistCta ? (
              scrollsToWaitlist ? (
                <Button
                  type="button"
                  onClick={handleWaitlistClick}
                  className="h-9 rounded-xl bg-[var(--indigo)] px-4 text-sm font-semibold text-white hover:bg-[var(--indigo)]/90"
                >
                  Join the waitlist
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-9 rounded-xl bg-[var(--indigo)] px-4 text-sm font-semibold text-white hover:bg-[var(--indigo)]/90"
                >
                  <Link href={`/#${WAITLIST_SECTION_ID}`}>Join the waitlist</Link>
                </Button>
              )
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="text-[var(--indigo)] hover:bg-[var(--indigo)]/10 hover:text-[var(--indigo)] md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls={menuPanelId}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            id={menuPanelId}
            aria-label="Main"
            className="border-t border-border/50 px-6 py-5 md:hidden"
          >
            <ul className="-mx-6 flex flex-col gap-1">
              <li>
                <NavLink
                  href="/"
                  active={isHome}
                  onNavigate={closeMobileMenu}
                  className="block w-full py-2.5 text-center text-base"
                >
                  Home
                </NavLink>
              </li>
              {showBlog ? (
                <li>
                  <NavLink
                    href="/blog"
                    active={isBlogActive}
                    onNavigate={closeMobileMenu}
                    className="block w-full py-2.5 text-center text-base"
                  >
                    {BLOG_TITLE}
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}
