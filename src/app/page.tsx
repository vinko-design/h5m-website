import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { UseCases } from "@/components/use-cases";
import { WhatIsIt } from "@/components/what-is-it";
import { WaitlistForm } from "@/components/waitlist-form";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Shared goals for couples`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: SITE_URL,
    title: `${SITE_NAME} — Shared goals for couples`,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <WhatIsIt />
      <Features />
      <UseCases />
      <section id="waitlist" className="scroll-mt-20 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm md:p-12">
          <h2 className="text-2xl font-bold text-[var(--navy)] md:text-3xl">
            Ready to create more high-five moments together?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join the waitlist and be among the first couples building their
            future with the High Five Moments app.
          </p>
          <div className="mx-auto mt-8 flex justify-center">
            <WaitlistForm id="cta-waitlist" />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
