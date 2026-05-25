import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n-context";
import { CartProvider } from "@/lib/cart-context";
import { ContentProvider } from "@/lib/content-context";
import { getSiteContent } from "@/lib/site-content";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_PHONE, SITE_EMAIL, SITE_WHATSAPP } from "@/lib/constants";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

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

export const dynamic = "force-dynamic";

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
        "streetAddress": "Al Hassa Village",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detect if we're on the Payload admin or API routes.
  // middleware.ts forwards x-pathname. If we're in /cms/* or /api/payload/*,
  // render a bare-bones shell so Payload's own layout owns the page entirely.
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isPayload =
    pathname.startsWith("/cms") || pathname.startsWith("/api/payload");

  if (isPayload) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  // Public site: load CMS content + wrap in providers, fonts, JSON-LD.
  const content = await getSiteContent();
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ContentProvider content={content}>
            <CartProvider>{children}</CartProvider>
          </ContentProvider>
        </LanguageProvider>
        <WhatsAppButton phone={SITE_WHATSAPP} />
      </body>
    </html>
  );
}
