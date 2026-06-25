"use server";

import { render } from "@react-email/render";
import { Resend } from "resend";
import { z } from "zod";

import WelcomeEmail from "@/emails/welcome";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { createServiceRoleClient } from "@/lib/supabase/server";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "You must agree to receive launch updates.",
    }),
  website: z.string().optional().default(""),
});

export type WaitlistState = {
  success?: boolean;
  error?: string;
  alreadyOnList?: boolean;
};

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const parsed = waitlistSchema.safeParse({
    email: formData.get("email"),
    consent: formData.get("consent") === "on",
    website: (formData.get("website") as string | null) ?? "",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { error: firstError ?? "Please check your details and try again." };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  try {
    const supabase = createServiceRoleClient();

    const { error: insertError } = await supabase.from("waitlist_signups").insert({
      email: parsed.data.email.toLowerCase().trim(),
      consent_given: true,
      source: "homepage",
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          success: true,
          alreadyOnList: true,
        };
      }

      console.error("Waitlist insert error:", insertError);
      return { error: "Something went wrong. Please try again." };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (resendApiKey && fromEmail) {
      const resend = new Resend(resendApiKey);

      const html = await render(WelcomeEmail({ siteUrl: SITE_URL }));

      const { error: emailError } = await resend.emails.send({
        from: `${SITE_NAME} <${fromEmail}>`,
        to: parsed.data.email.toLowerCase().trim(),
        subject: "You're on the list — high five! ✋",
        html,
      });

      if (emailError) {
        console.error("Resend error:", emailError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Waitlist error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
