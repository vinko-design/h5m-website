import { SHOW_SOCIAL_PROOF } from "@/lib/site-config";

export function SocialProof() {
  if (!SHOW_SOCIAL_PROOF) {
    return null;
  }

  return (
    <section className="px-6 py-16" aria-labelledby="social-proof-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="social-proof-heading"
          className="text-2xl font-bold text-[var(--navy)]"
        >
          Join couples building their life together
        </h2>
        <p className="mt-4 text-muted-foreground">
          Real stories and signup counts will appear here once we have them.
        </p>
      </div>
    </section>
  );
}
