# Savanna Grand Hotel & Spa

A responsive, Vercel-ready Next.js App Router site for Savanna Grand Hotel & Spa in Naivasha, Kenya. The page takes its layout cues from the uploaded VacayHome reference, including a utility bar, clean masthead, wide photographic hero, service ribbon, room gallery, resort feature blocks, quote slider and deep footer, while using new Savanna Grand copy and bespoke generated imagery. It uses patched Next.js 15.5.27 rather than the requested Next.js 14 line, whose latest release still has critical security advisories; the App Router and TypeScript setup remain the same.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Node.js 20+ is recommended.

## Vercel setup

1. Import this repository into Vercel and use the default Next.js build settings (`npm run build`).
2. Add an Upstash Redis store from the Vercel Marketplace, then configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. The Edge middleware uses it for shared rate limiting; booking and contact inquiries are stored for one year.
3. To deliver booking/contact email, configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `BOOKING_EMAIL_TO` (optionally `CONTACT_EMAIL_TO`). The sender domain must be verified with Resend.
4. To send a WhatsApp Cloud API booking alert, configure `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO`, and an approved `WHATSAPP_BOOKING_TEMPLATE` in Meta. Optional version/language overrides are `WHATSAPP_API_VERSION` and `WHATSAPP_TEMPLATE_LANGUAGE`.
5. Set `NEXT_PUBLIC_SITE_URL` to the canonical production URL for canonical/Open Graph metadata and the sitemap.

Without the optional Redis/email/WhatsApp credentials, local form submissions still return a reference and rate limiting uses a process-local fallback, but there is no durable storage or outbound notification. Availability is intentionally an indicative JSON calendar (`lib/availability-calendar.json`), not a live reservation engine; the reservations team must confirm requests. Update the room inventory, prices, package terms, location details and guest-review samples with approved hotel data before public launch.

## API routes

- `POST /api/availability`: validates dates, guest and room counts, then checks the JSON date exception list.
- `GET /api/rooms`: returns the room catalogue.
- `POST /api/booking`: validates and stores an enquiry, then attempts configured email and WhatsApp notifications.
- `POST /api/contact`: validates a contact and newsletter enquiry, stores it and attempts configured email notification.

All API endpoints have rate limiting. Shared, distributed limits are applied in `middleware.ts` when Upstash is configured; route-level in-memory limiting is the local fallback.
