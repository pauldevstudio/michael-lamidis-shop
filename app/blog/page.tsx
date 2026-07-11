import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import BlogContent from "./BlogContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog — Appliance Tips, Guides & Savings",
  description:
    "Expert guides, buying tips, and money-saving strategies for appliances in Cyprus. Written by the Michael Lamidis team.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Appliance Blog — Tips, Guides & Money-Saving Strategies",
    description: "Expert buying guides and savings strategies for appliances in Cyprus.",
    url: `${SITE_URL}/blog`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Michael Lamidis blog" }],
  },
};

export default function BlogPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <BlogContent />
      </main>
      <Footer />
    </>
  );
}
