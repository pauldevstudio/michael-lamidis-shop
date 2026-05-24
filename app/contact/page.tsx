import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ContactSection from "@/components/sections/ContactSection";
import LeadCapture from "@/components/sections/LeadCapture";
import ContactHero from "./ContactHero";

export const metadata: Metadata = {
  title: "Contact Us — Get a Free Quote",
  description:
    "Contact Michael Lamidis for a free quote on certified open box appliances. Visit our Limassol showroom or reach out online. Response within 2 hours.",
};

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <ContactHero />
        <ContactSection />
        <LeadCapture />
      </main>
      <Footer />
    </>
  );
}
