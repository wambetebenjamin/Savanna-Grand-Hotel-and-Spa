import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const metadataBaseUrl = siteUrl || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: {
    default: "Savanna Grand Hotel & Spa | Lake Naivasha, Kenya",
    template: "%s | Savanna Grand Hotel & Spa",
  },
  description:
    "A softer kind of escape on the quiet shores of Lake Naivasha. Discover considered rooms, Savanna Kitchen, restorative spa rituals and warm Kenyan hospitality.",
  applicationName: "Savanna Grand Hotel & Spa",
  keywords: [
    "Savanna Grand Hotel",
    "Naivasha hotel",
    "Lake Naivasha accommodation",
    "Naivasha spa",
    "Kenya boutique hotel",
    "Savanna Kitchen",
  ],
  metadataBase: new URL(metadataBaseUrl),
  openGraph: {
    title: "Savanna Grand Hotel & Spa | Lake Naivasha",
    description:
      "A slower kind of stay on the quiet shores of Lake Naivasha. Find your room to roam.",
    type: "website",
    siteName: "Savanna Grand Hotel & Spa",
    images: [
      {
        url: "/images/hero-1.jpg",
        width: 1376,
        height: 768,
        alt: "Savanna Grand Hotel by Lake Naivasha at sunset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Savanna Grand Hotel & Spa | Lake Naivasha",
    description: "A slower kind of stay on the quiet shores of Lake Naivasha.",
    images: ["/images/hero-1.jpg"],
  },
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  category: "travel",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#162541",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
