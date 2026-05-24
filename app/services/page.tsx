import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services — Appliance Sourcing, Installation & Repair",
  description:
    "Professional open box appliance sourcing, installation, repair and delivery services in Limassol, Cyprus. Certified technicians, competitive rates.",
};

export default function ServicesPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <ServicesContent />
      </main>
      <Footer />
    </>
  );
}
