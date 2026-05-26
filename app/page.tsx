import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import Hero from "@/components/sections/Hero";
import TrustBadges from "@/components/sections/TrustBadges";
import Features from "@/components/sections/Features";
import Services from "@/components/sections/Services";
import ProductGallery from "@/components/sections/ProductGallery";
import Testimonials from "@/components/sections/Testimonials";
import Statistics from "@/components/sections/Statistics";
import FAQ from "@/components/sections/FAQ";
import LeadCapture from "@/components/sections/LeadCapture";
import ContactSection from "@/components/sections/ContactSection";
import CategoryStrip from "@/components/sections/CategoryStrip";
import { ContentProvider } from "@/lib/content-context";
import { getSiteContent } from "@/lib/site-content";

// Cache the page for 30s; admin saves call revalidateTag("site-content")
// so live edits in Content / Business / SEO etc. flush both this cache
// and the underlying getSiteContent cache immediately.
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Michael Lamidis | Premium Open Box Appliances Cyprus",
  description:
    "Certified open box appliances at 30–70% off retail. Samsung, LG, Bosch, Miele & more. Free delivery, 12-month warranty. Limassol, Cyprus.",
};

export default async function HomePage() {
  const content = await getSiteContent();
  return (
    <ContentProvider content={content}>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <CategoryStrip />
        <Features />
        <Services />
        <ProductGallery />
        <Testimonials />
        <Statistics />
        <FAQ />
        <LeadCapture />
        <ContactSection />
      </main>
      <Footer />
    </ContentProvider>
  );
}
