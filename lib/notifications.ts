import { Redis } from "@upstash/redis";

export type BookingInquiry = {
  referenceId: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  adults: number;
  rooms: number;
  specialRequests?: string;
  createdAt: string;
};

export type ContactInquiry = {
  referenceId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

export async function persistInquiry(
  key: string,
  record: BookingInquiry | ContactInquiry,
): Promise<"upstash" | "unconfigured"> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return "unconfigured";
  }
  await Redis.fromEnv().set(key, JSON.stringify(record), { ex: 60 * 60 * 24 * 365 });
  return "upstash";
}

async function sendResendEmail(subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.BOOKING_EMAIL_TO || process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !from || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    console.error("Resend notification failed:", response.status, await response.text());
    return false;
  }
  return true;
}

async function sendWhatsAppBookingAlert(booking: BookingInquiry): Promise<boolean> {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_NOTIFY_TO;
  if (!token || !phoneNumberId || !recipient) return false;

  const version = process.env.WHATSAPP_API_VERSION || "v22.0";
  const templateName = process.env.WHATSAPP_BOOKING_TEMPLATE || "booking_inquiry_alert";
  const language = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en";
  const parameters = [
    booking.referenceId,
    booking.name,
    `${booking.checkIn} to ${booking.checkOut}`,
    booking.roomType,
    booking.phone,
  ].map((text) => ({ type: "text", text }));

  const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components: [{ type: "body", parameters }],
      },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    console.error("WhatsApp booking notification failed:", response.status, await response.text());
    return false;
  }
  return true;
}

export async function notifyBooking(booking: BookingInquiry) {
  const emailText = [
    `New Savanna Grand booking inquiry · ${booking.referenceId}`,
    `Guest: ${booking.name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Stay: ${booking.checkIn} to ${booking.checkOut}`,
    `Room: ${booking.roomType} · ${booking.rooms} room(s) · ${booking.adults} adult(s)`,
    `Special requests: ${booking.specialRequests || "None"}`,
  ].join("\n");

  const [email, whatsapp] = await Promise.allSettled([
    sendResendEmail(`New booking inquiry · ${booking.referenceId}`, emailText),
    sendWhatsAppBookingAlert(booking),
  ]);
  return {
    email: email.status === "fulfilled" && email.value ? "sent" : "not-configured-or-failed",
    whatsapp: whatsapp.status === "fulfilled" && whatsapp.value ? "sent" : "not-configured-or-failed",
  } as const;
}

export async function notifyContact(contact: ContactInquiry) {
  const text = [
    `New Savanna Grand contact message · ${contact.referenceId}`,
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone || "Not provided"}`,
    `Message: ${contact.message}`,
  ].join("\n");
  try {
    return await sendResendEmail(`New contact message · ${contact.referenceId}`, text);
  } catch (error) {
    console.error("Contact email notification failed:", error);
    return false;
  }
}
