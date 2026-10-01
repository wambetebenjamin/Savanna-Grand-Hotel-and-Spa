import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { notifyContact, persistInquiry, type ContactInquiry } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/[<>]/g, "").slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const rate = await enforceRateLimit(request, "contact", 8);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please wait a moment and try again." },
      { status: 429, headers: { ...rateLimitHeaders(rate), "Retry-After": "60" } },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return NextResponse.json({ ok: false, error: "Your message is too large." }, { status: 413, headers: rateLimitHeaders(rate) });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Please send a valid message." }, { status: 400, headers: rateLimitHeaders(rate) });
  }

  const name = clean(payload.name, 100);
  const email = clean(payload.email, 160).toLowerCase();
  const phone = clean(payload.phone, 40);
  const message = clean(payload.message, 2000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Please provide your name, a valid email and a message." },
      { status: 422, headers: rateLimitHeaders(rate) },
    );
  }

  const contact: ContactInquiry = {
    referenceId: `SGC-${randomUUID().slice(0, 8).toUpperCase()}`,
    name,
    email,
    phone,
    message,
    createdAt: new Date().toISOString(),
  };

  let storage: "upstash" | "unconfigured";
  try {
    storage = await persistInquiry(`contact:${contact.referenceId}`, contact);
  } catch (error) {
    console.error("Could not store contact message:", error);
    return NextResponse.json(
      { ok: false, error: "We could not send your message right now. Please try again or reach us on WhatsApp." },
      { status: 503, headers: rateLimitHeaders(rate) },
    );
  }

  const emailSent = await notifyContact(contact);
  return NextResponse.json(
    {
      ok: true,
      referenceId: contact.referenceId,
      storage,
      notification: emailSent ? "sent" : "not-configured-or-failed",
      message: "Thank you for getting in touch. Our team will reply as soon as possible.",
    },
    { status: 201, headers: { ...rateLimitHeaders(rate), "Cache-Control": "no-store" } },
  );
}
