import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Features } from "@/components/sections/Features";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { FAQ } from "@/components/sections/FAQ";
import { CTABanner } from "@/components/sections/CTABanner";
import { AboutBlurb } from "@/components/sections/AboutBlurb";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { getSiteContent } from "@/lib/content";
import { listProducts } from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  const [content, featured] = await Promise.all([
    getSiteContent(),
    listProducts({ featured: true, limit: 4 }),
  ]);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: content.business.name,
    description: content.business.description,
    telephone: content.business.phone,
    email: content.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.business.address,
      addressCountry: "CY",
    },
    openingHours: content.business.hours,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <Header />
      <main>
        <Hero hero={content.hero} stats={content.stats} />
        <TrustStrip brands={content.brands} />
        <Features features={content.features} />
        <Categories categories={content.categories} />
        <FeaturedProducts products={featured} />
        <Process steps={content.process} />
        <Testimonials testimonials={content.testimonials} />
        <PricingTiers tiers={content.pricing} />
        <AboutBlurb about={content.about} />
        <FAQ faqs={content.faqs} />
        <CTABanner cta={content.cta} phone={content.business.phone} />
      </main>
      <Footer content={content} />
      <ChatBot />
    </>
  );
}
