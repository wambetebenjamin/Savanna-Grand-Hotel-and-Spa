import SiteHome from "@/components/SiteHome";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const hotelSchema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Savanna Grand Hotel & Spa",
  description:
    "A lakeside hotel and spa in Naivasha, Kenya, with rooms and suites, Savanna Kitchen, wellness treatments and event facilities.",
  telephone: "+254112272061",
  priceRange: "KES 8,000+ per night",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Naivasha",
    addressRegion: "Nakuru County",
    addressCountry: "KE",
  },
  amenityFeature: [
    "Swimming pool",
    "Spa and wellness treatments",
    "Restaurant",
    "Conference facilities",
    "Free Wi-Fi",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  ...(siteUrl ? { url: siteUrl, image: `${siteUrl.replace(/\/$/, "")}/images/hero-1.jpg` } : {}),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema).replace(/</g, "\\u003c") }}
      />
      <SiteHome />
    </>
  );
}
