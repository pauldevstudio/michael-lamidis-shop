import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import FAQ from "@/components/sections/FAQ";
import LeadCapture from "@/components/sections/LeadCapture";
import FAQHero from "./FAQHero";
import { SITE_URL } from "@/lib/constants";
import { translations } from "@/lib/translations";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Everything you need to know about open box appliances, warranties, returns, delivery and shopping with Michael Lamidis.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: "FAQ — Open Box Appliances, Warranties & Delivery",
    description: "Everything you need to know about shopping at Michael Lamidis. Warranties, returns, delivery and more.",
    url: `${SITE_URL}/faq`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Michael Lamidis FAQ" }],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: translations.en.faq.items.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <FAQHero />
        <FAQ />
        <LeadCapture />
      </main>
      <Footer />
    </>
  );
}
