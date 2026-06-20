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
};

export default function BlogPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <BlogContent />
      </main>
      <Footer />
    </>
  );
}
