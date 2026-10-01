import { NextRequest, NextResponse } from "next/server";
import calendarData from "@/lib/availability-calendar.json";
import { rooms } from "@/lib/rooms";
import { enforceRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BlockedDate = { date: string; roomType?: string };
type CalendarStore = {
  blockedDates: BlockedDate[];
  inventory: Record<string, number>;
};
const calendar = calendarData as CalendarStore;

function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export async function POST(request: NextRequest) {
  const rate = await enforceRateLimit(request, "availability", 20);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many availability checks. Please wait a moment and try again." },
      { status: 429, headers: { ...rateLimitHeaders(rate), "Retry-After": "60" } },
    );
  }

  let body: { checkIn?: unknown; checkOut?: unknown; adults?: unknown; rooms?: unknown; roomType?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Please send a valid availability request." }, { status: 400, headers: rateLimitHeaders(rate) });
  }

  const { checkIn, checkOut } = body;
  const roomCount = Number(body.rooms ?? 1);
  const adultCount = Number(body.adults ?? 2);
  const roomType = typeof body.roomType === "string" ? body.roomType : "any";
  if (!isDateOnly(checkIn) || !isDateOnly(checkOut) || checkOut <= checkIn || checkIn < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ ok: false, error: "Choose a valid check-in and check-out date." }, { status: 422, headers: rateLimitHeaders(rate) });
  }
  if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 5) {
    return NextResponse.json({ ok: false, error: "Choose between one and five rooms." }, { status: 422, headers: rateLimitHeaders(rate) });
  }
  if (!Number.isInteger(adultCount) || adultCount < 1 || adultCount > 12) {
    return NextResponse.json({ ok: false, error: "Choose between one and twelve adults." }, { status: 422, headers: rateLimitHeaders(rate) });
  }
  if (roomType !== "any" && !rooms.some((room) => room.id === roomType)) {
    return NextResponse.json({ ok: false, error: "Choose a room type from the list." }, { status: 422, headers: rateLimitHeaders(rate) });
  }

  const nights = Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86_400_000);
  const roomInventory = roomType === "any"
    ? Object.values(calendar.inventory).reduce((total, count) => total + count, 0)
    : calendar.inventory[roomType] ?? 0;
  const dateConflict = calendar.blockedDates.some((blocked) => {
    const overlaps = blocked.date >= checkIn && blocked.date < checkOut;
    return overlaps && (!blocked.roomType || blocked.roomType === "any" || roomType === "any" || blocked.roomType === roomType);
  });
  const available = !dateConflict && roomCount <= roomInventory;

  return NextResponse.json(
    {
      ok: true,
      available,
      checkIn,
      checkOut,
      nights,
      rooms: roomCount,
      adults: adultCount,
      roomType,
      message: available
        ? "Those dates look promising. Send an enquiry and our reservations team will confirm your stay."
        : "That selection is not currently available. Try different dates or enquire with our team.",
      source: "calendar-store",
      confirmationRequired: true,
    },
    { headers: { ...rateLimitHeaders(rate), "Cache-Control": "no-store" } },
  );
}
