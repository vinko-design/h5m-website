import { BrandLogo } from "@/components/brand-logo";
import { WaitlistForm } from "@/components/waitlist-form";

export function Hero() {
  return (
    <section className="relative px-6 pb-16 pt-12 md:pb-24 md:pt-20">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[0.05] md:opacity-[0.1]"
        style={{
          background: "linear-gradient(135deg, var(--indigo), var(--gold))",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-[0.05] md:opacity-[0.1]"
        style={{
          background: "linear-gradient(135deg, var(--gold), var(--indigo))",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-5xl text-center">
        <div id="hero-brand" className="mb-10 flex justify-center md:mb-12">
          <BrandLogo size="hero" />
        </div>
        <div id="hero-brand-sentinel" className="h-px w-full" aria-hidden />

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold-subtle px-4 py-1.5 text-sm font-medium text-[var(--navy)]">
          <span aria-hidden="true">✋</span>
          <span>iOS & Android apps — coming soon</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[var(--navy)] md:text-5xl xl:text-6xl">
          <span className="block">Create more high-five moments</span>
          <span className="block">with your partner.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Stay aligned, support each other&apos;s growth, and create more
          reasons to celebrate along the way.
        </p>

        <div className="mx-auto mt-10 flex justify-center">
          <WaitlistForm id="hero-waitlist" />
        </div>
      </div>
    </section>
  );
}
