import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/footer";
import {
  OG_IMAGE_PATH,
  PRIVACY_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: PRIVACY_DESCRIPTION,
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/privacy`,
    title: `Privacy Policy | ${SITE_NAME}`,
    description: PRIVACY_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy | ${SITE_NAME}`,
    description: PRIVACY_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-24 md:pb-16 md:pt-28">
        <h1 className="text-3xl font-bold text-[var(--navy)] md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-muted-foreground">Last updated: June 2026</p>

        <div className="prose prose-neutral mt-10 max-w-none space-y-6 text-[var(--navy)]">
          <section>
            <h2 className="text-xl font-semibold">Who we are</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {SITE_NAME} ({SITE_URL}) is a private app for couples to stay
              aligned and track shared goals, habits, and milestones. This
              policy explains how we handle information when you join our
              waitlist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">What we collect</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              When you join the waitlist, we collect your email address and
              record that you gave consent to receive launch updates. We also
              store when you signed up and which page you came from.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How we use your data</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              We use your email to send a welcome message and occasional launch
              updates about {SITE_NAME}. We do not sell your personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Where data is stored</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Waitlist signups are stored in{" "}
              <a
                href="https://supabase.com"
                className="text-[var(--indigo)] underline-offset-2 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Supabase
              </a>{" "}
              (PostgreSQL). Welcome emails are sent via{" "}
              <a
                href="https://resend.com"
                className="text-[var(--indigo)] underline-offset-2 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Resend
              </a>
              . Both providers process data on our behalf under their respective
              privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Your rights</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              You can request access to or deletion of your waitlist data by
              emailing us at hello@highfivemoments.app. You may unsubscribe
              from launch updates at any time using the link in our emails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              We use Vercel Analytics to understand site traffic and measure
              waitlist conversions. This does not use third-party advertising
              cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Questions about this policy? Email{" "}
              <a
                href="mailto:hello@highfivemoments.app"
                className="text-[var(--indigo)] underline-offset-2 hover:underline"
              >
                hello@highfivemoments.app
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-12">
          <Link
            href="/"
            className="text-[var(--indigo)] underline-offset-2 hover:underline"
          >
            ← Back to home
          </Link>
        </p>
      </article>
      <Footer />
    </main>
  );
}
