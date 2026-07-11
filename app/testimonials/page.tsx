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
  openGraph: {
    title: "Customer Reviews — 4.9★ Rating, Thousands of Happy Families",
    description: "Real stories from customers who saved 30–70% on premium appliances at Michael Lamidis.",
    url: `${SITE_URL}/testimonials`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Michael Lamidis reviews" }],
  },
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
