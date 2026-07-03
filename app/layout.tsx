import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n-context";
import { CartProvider } from "@/lib/cart-context";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_PHONE, SITE_EMAIL } from "@/lib/constants";
import AIChatOnPublic from "@/components/shared/AIChatOnPublic";
import Analytics from "@/components/shared/Analytics";
import MetaPixel from "@/components/shared/MetaPixel";
import AutoTrack from "@/components/shared/AutoTrack";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { CookieConsentProvider } from "@/lib/cookie-consent";
import CookieBanner from "@/components/shared/CookieBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  authors: [{ name: "Michael Lamidis" }],
  creator: "Michael Lamidis",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Open Box Appliances`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }],
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
};

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
        "streetAddress": "Alassa Village",
        "addressLocality": "Limassol",
        "addressCountry": "CY",
      },
      "areaServed": { "@type": "Country", "name": "Cyprus" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": SITE_NAME,
      "description": SITE_DESCRIPTION,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout is intentionally synchronous so Vercel can cache the HTML shell.
  // The previous version awaited headers() and getSiteContent() on every
  // request, forcing dynamic rendering and 18 MongoDB queries per page.
  // Admin/cms route detection moved into the AIChatOnPublic client wrapper.
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <CookieConsentProvider>
          <Analytics />
          <MetaPixel />
          <AutoTrack />
          <LanguageProvider>
            <CartProvider>{children}</CartProvider>
            <CookieBanner />
          </LanguageProvider>
          <AIChatOnPublic />
          <WhatsAppButton />
          {/* Vercel Speed Insights — cookieless real-user Core Web Vitals (LCP,
              INP, CLS, FCP, TTFB) from actual visitors. Mounted unconditionally
              because it sets no cookies and collects no PII. */}
          <SpeedInsights />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
