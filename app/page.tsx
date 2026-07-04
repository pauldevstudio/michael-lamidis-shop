import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import ProductGallery from "@/components/sections/ProductGallery";
import Testimonials from "@/components/sections/Testimonials";
import Statistics from "@/components/sections/Statistics";
import FAQ from "@/components/sections/FAQ";
import LeadCapture from "@/components/sections/LeadCapture";
import ContactSection from "@/components/sections/ContactSection";
import CategoryStrip from "@/components/sections/CategoryStrip";
import PromoPopup from "@/components/shared/PromoPopup";
import { ContentProvider } from "@/lib/content-context";
import { getSiteContent, getFeaturedProducts, getPromoProducts } from "@/lib/site-content";
import { SITE_URL } from "@/lib/constants";

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
  const [content, products, promoItems] = await Promise.all([
    getSiteContent(),
    getFeaturedProducts(8),
    getPromoProducts(),
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
