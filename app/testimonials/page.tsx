import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import TestimonialsContent from "./TestimonialsContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Customer Testimonials — Real Stories, Real Savings",
  description:
    "Read genuine reviews from thousands of satisfied customers who saved 30–70% on premium appliances at Michael Lamidis.",
  alternates: { canonical: `${SITE_URL}/testimonials` },
};

export default function TestimonialsPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <TestimonialsContent />
      </main>
      <Footer />
    </>
  );
}
