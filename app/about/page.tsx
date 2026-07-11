import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import AboutContent from "./AboutContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us — Our Story & Mission",
  description:
    "Learn about Michael Lamidis — Cyprus's premier open box appliance destination, founded in 2012 with a mission to make premium appliances accessible to every family.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Michael Lamidis — Premium Open Box Appliances Since 2012",
    description: "Cyprus's trusted open box appliance destination. Top brands, 30–70% off retail, certified quality.",
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Michael Lamidis showroom" }],
  },
};

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
