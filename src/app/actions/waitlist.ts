"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

import WelcomeEmail from "@/emails/welcome";
import { CONTACT_EMAIL, MAILING_ADDRESS, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  buildUnsubscribeUrl,
  checkAndRecordRateLimits,
  getClientIp,
  isEmailUnsubscribed,
  isWaitlistProductionEnabled,
  verifyTurnstileToken,
} from "@/lib/waitlist/security";

const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254, "Please enter a valid email address."),
  consent: z.boolean().refine((value) => value === true, {
    message: "You must agree to receive launch updates.",
  }),
  website: z.string().max(100).optional().default(""),
  turnstileToken: z.string().min(1, "Please complete the verification check."),
});

export type WaitlistState = {
  success?: boolean;
  error?: string;
};

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const parsed = waitlistSchema.safeParse({
    email: formData.get("email"),
    consent: formData.get("consent") === "on",
    website: (formData.get("website") as string | null) ?? "",
    turnstileToken: (formData.get("turnstileToken") as string | null) ?? "",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { error: firstError ?? "Please check your details and try again." };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  const normalizedEmail = parsed.data.email;
  const requestHeaders = await headers();
  const clientIp = getClientIp(
    requestHeaders.get("x-forwarded-for"),
    requestHeaders.get("x-real-ip"),
  );

  const turnstileValid = await verifyTurnstileToken(
    parsed.data.turnstileToken,
    clientIp,
  );

  if (!turnstileValid) {
    return { error: "Verification failed. Please try again." };
  }

  if (!isWaitlistProductionEnabled()) {
    console.info("[waitlist] signup_skipped_non_production");
    return { success: true };
  }

  const rateLimit = await checkAndRecordRateLimits(normalizedEmail, clientIp);

  if (!rateLimit.allowed) {
    return {
      error:
        rateLimit.reason === "limited"
          ? "Too many attempts. Please try again later."
          : "Signups are temporarily unavailable. Please try again.",
    };
  }

  try {
    const supabase = createServiceRoleClient();

    const { error: insertError } = await supabase.from("waitlist_signups").insert({
      email: normalizedEmail,
      consent_given: true,
      source: "homepage",
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return { success: true };
      }

      console.error("[waitlist] insert_failed", {
        code: insertError.code ?? "unknown",
      });
      return { error: "Something went wrong. Please try again." };
    }

    const unsubscribed = await isEmailUnsubscribed(normalizedEmail);

    if (unsubscribed) {
      console.info("[waitlist] welcome_email_skipped_unsubscribed");
      return { success: true };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (resendApiKey && fromEmail) {
      const resend = new Resend(resendApiKey);
      const unsubscribeUrl = buildUnsubscribeUrl(SITE_URL, normalizedEmail);

      const html = await render(
        WelcomeEmail({
          siteUrl: SITE_URL,
          unsubscribeUrl,
          mailingAddress: MAILING_ADDRESS,
          contactEmail: CONTACT_EMAIL,
        }),
      );

      const { error: emailError } = await resend.emails.send({
        from: `${SITE_NAME} <${fromEmail}>`,
        to: normalizedEmail,
        subject: "You're on the list - high five! 🖐️",
        html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${CONTACT_EMAIL}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      if (emailError) {
        console.error("[waitlist] resend_send_failed", {
          name: emailError.name ?? "unknown",
        });
      }
    } else {
      console.warn("[waitlist] resend_not_configured");
    }

    return { success: true };
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "unknown";
    console.error("[waitlist] unexpected_error", { name: errorName });
    return { error: "Something went wrong. Please try again." };
  }
}
