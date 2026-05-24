import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import FAQ from "@/components/sections/FAQ";
import LeadCapture from "@/components/sections/LeadCapture";
import FAQHero from "./FAQHero";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Everything you need to know about open box appliances, warranties, returns, delivery and shopping with Michael Lamidis.",
};

export default function FAQPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <FAQHero />
        <FAQ />
        <LeadCapture />
      </main>
      <Footer />
    </>
  );
}
