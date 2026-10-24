import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { TurnstileProvider } from "@/components/turnstile-provider";
import { UseCases } from "@/components/use-cases";
import { WaitlistCta } from "@/components/waitlist-cta";
import { WhatIsIt } from "@/components/what-is-it";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <TurnstileProvider>
      <main className="overflow-x-hidden">
        <Hero />
        <WhatIsIt />
        <Features />
        <UseCases />
        <WaitlistCta />
        <Footer />
      </main>
    </TurnstileProvider>
  );
}
