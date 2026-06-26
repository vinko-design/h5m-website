import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Thank You",
  alternates: {
    canonical: "/thank-you",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-gold-subtle text-4xl">
          <span aria-hidden="true">✋</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--navy)] md:text-4xl">
          <span className="block">Thank you!</span>
          <span className="block">You&apos;re on the list.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
          High five — we really appreciate you joining early. We&apos;ll email
          you when {SITE_NAME} is ready for early access.
        </p>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground/80">
          Check your inbox for a welcome note.
        </p>
        <Link
          href="/"
          className="mt-8 text-[var(--indigo)] underline-offset-2 hover:underline"
        >
          ← Back to home
        </Link>
      </section>
      <Footer />
    </main>
  );
}
