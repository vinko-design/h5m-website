"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { TurnstileField } from "@/components/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initialState: WaitlistState = {};
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface WaitlistFormProps {
  className?: string;
  id?: string;
}

export function WaitlistForm({ className, id = "waitlist-form" }: WaitlistFormProps) {
  const router = useRouter();
  const trackedRef = useRef(false);
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [state, formAction, isPending] = useActionState(joinWaitlist, initialState);

  useEffect(() => {
    if (state.success && !trackedRef.current) {
      trackedRef.current = true;
      track("Waitlist Submit");
      router.push("/thank-you");
    }
  }, [state.success, router]);

  const canSubmit = Boolean(turnstileSiteKey && turnstileToken);

  return (
    <form
      id={id}
      action={formAction}
      className={cn("w-full max-w-md space-y-4", className)}
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <Input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          aria-required="true"
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-2xl border-border/60 bg-white px-4 text-base shadow-sm"
        />
      </div>

      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${id}-website`}>Website</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          maxLength={100}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-required="true"
          className="mt-1 size-4 shrink-0 rounded border-border accent-[var(--indigo)]"
        />
        <label
          htmlFor={`${id}-consent`}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          I agree to receive launch updates from High Five Moments.
          <br />
          See our{" "}
          <Link href="/privacy" className="text-[var(--indigo)] underline-offset-2 hover:underline">
            privacy policy
          </Link>
          .
        </label>
      </div>

      {turnstileSiteKey ? (
        <TurnstileField
          siteKey={turnstileSiteKey}
          token={turnstileToken}
          onTokenChange={setTurnstileToken}
        />
      ) : (
        <p className="text-sm text-destructive" role="alert">
          Waitlist signups are temporarily unavailable.
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || !canSubmit}
        className="h-12 w-full rounded-2xl bg-[var(--indigo)] text-base font-semibold text-white hover:bg-[var(--indigo)]/90"
      >
        {isPending ? "Joining…" : "Join the waitlist"}
      </Button>

      <div aria-live="polite" aria-atomic="true" className="min-h-5">
        {state.error && (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
