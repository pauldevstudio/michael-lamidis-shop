import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import Hero from "@/components/sections/Hero";
import CategoryStrip from "@/components/sections/CategoryStrip";
import ProductGallery from "@/components/sections/ProductGallery";
import { ContentProvider } from "@/lib/content-context";
import { getSiteContent, getFeaturedProducts, getPromoProducts } from "@/lib/site-content";
import { SITE_URL } from "@/lib/constants";

const Services = dynamic(() => import("@/components/sections/Services"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const Statistics = dynamic(() => import("@/components/sections/Statistics"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const LeadCapture = dynamic(() => import("@/components/sections/LeadCapture"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));
const PromoPopup = dynamic(() => import("@/components/shared/PromoPopup"));

// ISR: serve cached HTML from the edge (TTFB ~0.2s) and refresh every 5 min.
// Admin content/product saves already call revalidatePath("/", "layout"), so
// edits appear immediately instead of waiting for the interval — no need for
// force-dynamic, which previously re-rendered against MongoDB on every visit.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Michael Lamidis | Premium Open Box Appliances Cyprus",
  description:
    "Certified open box appliances at 30–70% off retail. Samsung, LG, Bosch, Miele & more. Island-wide delivery, 12-month warranty. Limassol, Cyprus.",
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const content = await getSiteContent();
  const [products, promoItems] = await Promise.all([
    getFeaturedProducts(8),
    getPromoProducts(content.promoPopup.items),
  ]);
  return (
    <ContentProvider content={content}>
      <PromoPopup items={promoItems} />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <CategoryStrip />
        <Services />
        <ProductGallery products={products} />
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
