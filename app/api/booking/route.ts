import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { rooms } from "@/lib/rooms";
import { enforceRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { notifyBooking, persistInquiry, type BookingInquiry } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/[<>]/g, "").slice(0, max) : "";
}

function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function makeReferenceId(): string {
  return `SG-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const rate = await enforceRateLimit(request, "booking", 8);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many booking requests. Please wait a moment and try again." },
      { status: 429, headers: { ...rateLimitHeaders(rate), "Retry-After": "60" } },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return NextResponse.json({ ok: false, error: "Your request is too large." }, { status: 413, headers: rateLimitHeaders(rate) });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Please send a valid booking request." }, { status: 400, headers: rateLimitHeaders(rate) });
  }

  const name = text(payload.name, 100);
  const email = text(payload.email, 160).toLowerCase();
  const phone = text(payload.phone, 40);
  const checkIn = text(payload.checkIn, 10);
  const checkOut = text(payload.checkOut, 10);
  const roomValue = text(payload.roomType, 60);
  const room = rooms.find((entry) => entry.id === roomValue || entry.name === roomValue);
  const adults = Number(payload.adults ?? 2);
  const roomCount = Number(payload.rooms ?? 1);
  const specialRequests = text(payload.specialRequests, 2000);
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422, headers: rateLimitHeaders(rate) });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422, headers: rateLimitHeaders(rate) });
  }
  if (phoneDigits.length < 7 || phoneDigits.length > 16) {
    return NextResponse.json({ ok: false, error: "Please enter a valid phone number." }, { status: 422, headers: rateLimitHeaders(rate) });
  }
  if (!isDateOnly(checkIn) || !isDateOnly(checkOut) || checkOut <= checkIn || checkIn < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ ok: false, error: "Choose a valid check-in and check-out date." }, { status: 422, headers: rateLimitHeaders(rate) });
  }
  if (!room || !Number.isInteger(adults) || adults < 1 || adults > 12 || !Number.isInteger(roomCount) || roomCount < 1 || roomCount > 5) {
    return NextResponse.json({ ok: false, error: "Choose a valid room type, guest count and number of rooms." }, { status: 422, headers: rateLimitHeaders(rate) });
  }

  const booking: BookingInquiry = {
    referenceId: makeReferenceId(),
    name,
    email,
    phone,
    checkIn,
    checkOut,
    roomType: room.name,
    adults,
    rooms: roomCount,
    specialRequests,
    createdAt: new Date().toISOString(),
  };

  let storage: "upstash" | "unconfigured";
  try {
    storage = await persistInquiry(`booking:${booking.referenceId}`, booking);
  } catch (error) {
    console.error("Could not store booking inquiry:", error);
    return NextResponse.json(
      { ok: false, error: "We could not save your enquiry right now. Please try again or contact us on WhatsApp." },
      { status: 503, headers: rateLimitHeaders(rate) },
    );
  }

  const notifications = await notifyBooking(booking).catch((error) => {
    console.error("Booking notifications failed:", error);
    return { email: "not-configured-or-failed", whatsapp: "not-configured-or-failed" } as const;
  });

  return NextResponse.json(
    {
      ok: true,
      referenceId: booking.referenceId,
      message: "Your enquiry is with our reservations team. We will be in touch shortly to confirm your stay.",
      storage,
      notifications,
    },
    { status: 201, headers: { ...rateLimitHeaders(rate), "Cache-Control": "no-store" } },
  );
}
