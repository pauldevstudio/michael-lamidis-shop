import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://michaellamidis.com.cy"),
  title: {
    default: "Michael Lamidis | Premium Open Box Appliances Cyprus",
    template: "%s · Michael Lamidis",
  },
  description:
    "Cyprus's premier open box appliance destination. Samsung, Bosch, Miele and more at 30–70% off, certified and warrantied.",
  openGraph: {
    title: "Michael Lamidis | Premium Open Box Appliances Cyprus",
    description: "Premium appliances at 30–70% off retail. Certified, warrantied, delivered island-wide.",
    siteName: "Michael Lamidis",
    locale: "en_CY",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${heading.variable}`}>
      <body>{children}</body>
    </html>
  );
}
