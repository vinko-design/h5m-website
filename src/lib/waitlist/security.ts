import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

import { createServiceRoleClient } from "@/lib/supabase/server";

const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX_ATTEMPTS = 10;
const EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;
const EMAIL_MAX_ATTEMPTS = 5;

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "limited" | "unavailable" };

function getUnsubscribeSecret(): string {
  const secret =
    process.env.UNSUBSCRIBE_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error("Missing unsubscribe signing secret.");
  }

  return secret;
}

export function isWaitlistProductionEnabled(): boolean {
  return process.env.WAITLIST_PRODUCTION_ENABLED === "true";
}

export function getClientIp(forwardedFor: string | null, realIp: string | null): string {
  const forwarded = forwardedFor?.split(",")[0]?.trim();
  return forwarded || realIp || "unknown";
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error("[waitlist] turnstile_misconfigured");
    return false;
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: remoteIp,
        }),
      },
    );

    if (!response.ok) {
      console.error("[waitlist] turnstile_verify_http_error", {
        status: response.status,
      });
      return false;
    }

    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    console.error("[waitlist] turnstile_verify_failed");
    return false;
  }
}

async function getRecentAttempts(
  ipBucket: string,
  emailBucket: string,
) {
  const supabase = createServiceRoleClient();
  const emailSince = new Date(Date.now() - EMAIL_WINDOW_MS).toISOString();

  const query = () =>
    supabase
      .from("waitlist_rate_limit_events")
      .select("bucket, created_at")
      .in("bucket", [ipBucket, emailBucket])
      .gte("created_at", emailSince);

  let result = await query();

  if (result.error) {
    result = await query();
  }

  if (result.error) {
    console.error("[waitlist] rate_limit_count_failed", {
      code: result.error.code ?? "unknown",
    });
    return null;
  }

  const ipSince = Date.now() - IP_WINDOW_MS;
  const attempts = result.data ?? [];

  return {
    ipCount: attempts.filter(
      (attempt) =>
        attempt.bucket === ipBucket &&
        new Date(attempt.created_at).getTime() >= ipSince,
    ).length,
    emailCount: attempts.filter(
      (attempt) => attempt.bucket === emailBucket,
    ).length,
    supabase,
  };
}

export async function checkAndRecordRateLimits(
  normalizedEmail: string,
  clientIp: string,
): Promise<RateLimitResult> {
  const ipBucket = `ip:${clientIp}`;
  const emailBucket = `email:${normalizedEmail}`;

  const recentAttempts = await getRecentAttempts(ipBucket, emailBucket);

  if (!recentAttempts) {
    return { allowed: false, reason: "unavailable" };
  }

  const { ipCount, emailCount, supabase } = recentAttempts;

  if (ipCount >= IP_MAX_ATTEMPTS || emailCount >= EMAIL_MAX_ATTEMPTS) {
    console.warn("[waitlist] rate_limit_exceeded", {
      ipLimited: ipCount >= IP_MAX_ATTEMPTS,
      emailLimited: emailCount >= EMAIL_MAX_ATTEMPTS,
    });
    return { allowed: false, reason: "limited" };
  }

  const { error } = await supabase
    .from("waitlist_rate_limit_events")
    .insert([{ bucket: ipBucket }, { bucket: emailBucket }]);

  if (error) {
    console.error("[waitlist] rate_limit_record_failed", {
      code: error.code ?? "unknown",
    });
    return { allowed: false, reason: "unavailable" };
  }

  return { allowed: true };
}

export function createUnsubscribeToken(email: string): string {
  return createHmac("sha256", getUnsubscribeSecret())
    .update(email.toLowerCase().trim())
    .digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = createUnsubscribeToken(email);

  try {
    const expectedBuffer = Buffer.from(expected);
    const tokenBuffer = Buffer.from(token);

    if (expectedBuffer.length !== tokenBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, tokenBuffer);
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(siteUrl: string, email: string): string {
  const token = createUnsubscribeToken(email);
  const params = new URLSearchParams({
    email,
    token,
  });

  return `${siteUrl}/unsubscribe?${params.toString()}`;
}

export async function unsubscribeEmail(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("waitlist_signups")
    .update({ unsubscribed_at: now })
    .eq("email", normalizedEmail);

  if (error) {
    console.error("[waitlist] unsubscribe_update_failed", {
      code: error.code ?? "unknown",
    });
    return false;
  }

  return true;
}

export async function isEmailUnsubscribed(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("waitlist_signups")
    .select("unsubscribed_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("[waitlist] unsubscribe_lookup_failed", {
      code: error.code ?? "unknown",
    });
    return true;
  }

  return Boolean(data?.unsubscribed_at);
}
