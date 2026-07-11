import { NextResponse } from "next/server";

import {
  unsubscribeEmail,
  verifyUnsubscribeToken,
} from "@/lib/waitlist/security";

async function processUnsubscribe(email: string, token: string) {
  if (!verifyUnsubscribeToken(email, token)) {
    return { ok: false as const, reason: "invalid" as const };
  }

  const updated = await unsubscribeEmail(email);

  if (!updated) {
    return { ok: false as const, reason: "failed" as const };
  }

  return { ok: true as const };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!email || !token) {
    return NextResponse.redirect(new URL("/unsubscribe/confirmed?status=missing", url));
  }

  const result = await processUnsubscribe(email, token);
  const status = result.ok ? "success" : result.reason;

  return NextResponse.redirect(
    new URL(`/unsubscribe/confirmed?status=${status}`, url),
  );
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!email || !token) {
    return new NextResponse(null, { status: 400 });
  }

  const result = await processUnsubscribe(email, token);

  if (!result.ok) {
    return new NextResponse(null, {
      status: result.reason === "invalid" ? 400 : 500,
    });
  }

  return new NextResponse(null, { status: 200 });
}
