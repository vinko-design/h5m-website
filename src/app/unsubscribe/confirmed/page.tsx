import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: {
    index: false,
    follow: false,
  },
};

interface UnsubscribeConfirmedPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function UnsubscribeConfirmedPage({
  searchParams,
}: UnsubscribeConfirmedPageProps) {
  const { status = "missing" } = await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-[var(--navy)] md:text-4xl">
          {status === "success" ? "You’re unsubscribed" : "Unsubscribe"}
        </h1>

        {status === "success" ? (
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            You won&apos;t receive further launch updates from {SITE_NAME}.
          </p>
        ) : null}

        {status === "invalid" ? (
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            This unsubscribe link is invalid or has expired.
          </p>
        ) : null}

        {status === "failed" ? (
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            We couldn&apos;t process your request. Please email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=unsubscribe`}
              className="text-[var(--indigo)] underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        ) : null}

        {status === "missing" ? (
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Use the unsubscribe link in your email, or contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=unsubscribe`}
              className="text-[var(--indigo)] underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        ) : null}

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
