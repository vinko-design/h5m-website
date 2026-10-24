import { WaitlistForm } from "@/components/waitlist-form";

export function WaitlistCta() {
  return (
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
  );
}
