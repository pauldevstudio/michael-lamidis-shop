import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us — Our Story & Mission",
  description:
    "Learn about Michael Lamidis — Cyprus's premier open box appliance destination, founded in 2012 with a mission to make premium appliances accessible to every family.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
