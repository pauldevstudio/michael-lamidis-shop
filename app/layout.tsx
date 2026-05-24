import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n-context";
import { CartProvider } from "@/lib/cart-context";
import { ContentProvider } from "@/lib/content-context";
import { getSiteContent } from "@/lib/site-content";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_PHONE, SITE_EMAIL, SITE_ADDRESS } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030813",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Open Box Appliances Cyprus`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "open box appliances Cyprus",
    "certified used appliances",
    "Samsung LG Bosch open box",
    "appliance deals Limassol",
    "home appliances Cyprus",
    "used appliances Limassol",
    "μεταχειρισμένες συσκευές Κύπρος",
    "open box ψυγεία πλυντήρια",
    "Michael Lamidis",
    "ηλεκτρικές συσκευές Λεμεσός",
  ],
  authors: [{ name: "Michael Lamidis" }],
  creator: "Michael Lamidis",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "el_GR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Open Box Appliances`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Open Box Appliances Cyprus`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Open Box Appliances`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// JSON-LD structured data — LocalBusiness + WebSite
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      "name": SITE_NAME,
      "description": SITE_DESCRIPTION,
      "url": SITE_URL,
      "telephone": SITE_PHONE,
      "email": SITE_EMAIL,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Makarios Avenue",
        "addressLocality": "Limassol",
        "addressCountry": "CY",
        "postalCode": "3025",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 34.6823,
        "longitude": 33.0464,
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          "opens": "09:00",
          "closes": "20:00",
        },
      ],
      "priceRange": "€€",
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "areaServed": {
        "@type": "Country",
        "name": "Cyprus",
      },
      "sameAs": [
        "https://facebook.com/michaellamidisshop",
        "https://instagram.com/michaellamidisshop",
        "https://youtube.com/@michaellamidis",
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "347",
        "bestRating": "5",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": SITE_NAME,
      "description": SITE_DESCRIPTION,
      "publisher": { "@id": `${SITE_URL}/#business` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read content server-side so every page has access via ContentContext
  const content = await getSiteContent();

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ContentProvider content={content}>
            <CartProvider>
              {children}
            </CartProvider>
          </ContentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
