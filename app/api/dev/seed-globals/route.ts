/**
 * One-shot dev seed: populates every Payload global with realistic
 * Michael Lamidis sample data. Hit it once in the browser:
 *
 *   http://localhost:3000/api/dev/seed-globals
 *
 * Safe to re-run — globals are upserted via updateGlobal.
 * DELETE THIS FILE BEFORE PRODUCTION.
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const written: string[] = [];

    // Business Info
    await payload.updateGlobal({
      slug: "business-info",
      data: {
        name: "Michael Lamidis",
        tagline: "Cyprus's #1 Open Box Appliance Destination",
        description:
          "Certified open box appliances at 30-70% off retail. Samsung, LG, Bosch, Miele and more - backed by our 12-month Lamidis warranty.",
        phone: "+357 25 123 456",
        email: "info@michaellamidis.com.cy",
        address: "123 Makarios Avenue, Limassol 3025, Cyprus",
        hours: "Mon-Sat: 09:00 - 20:00",
        social: {
          facebook: "https://facebook.com/michaellamidisshop",
          instagram: "https://instagram.com/michaellamidisshop",
          youtube: "https://youtube.com/@michaellamidis",
        },
      },
    });
    written.push("business-info");

    // Home Hero
    await payload.updateGlobal({
      slug: "home-hero",
      data: {
        locationLabel: "Limassol, Cyprus",
        badge: "Certified Open Box Quality",
        headline: "Premium Home Appliances\nat 30-70% Off Retail",
        subheadline:
          "Refrigerators, washing machines, ovens & more - certified, warranted, and delivered free across Cyprus.",
        primaryCtaLabel: "Browse Products",
        primaryCtaHref: "/products",
        secondaryCtaLabel: "Visit Showroom",
        secondaryCtaHref: "/contact",
      },
    });
    written.push("home-hero");

    // About Page
    await payload.updateGlobal({
      slug: "about-content",
      data: {
        headline: "Redefining how Cyprus buys appliances",
        subheadline: "12 years of trust. 5000+ happy households. One mission.",
        story: [
          { text: "Michael Lamidis opened his first showroom in Limassol in 2012 with a simple belief: every Cypriot household deserves access to premium appliances without the premium price tag." },
          { text: "By specializing in certified open box products - returns, displays, and overstock from major manufacturers - we bridge the gap between retail luxury and real-family affordability. Every unit passes a 47-point inspection before it reaches you." },
          { text: "Today thousands of Cypriot homes are powered by Samsung, Bosch, LG, and Miele appliances they bought from us - at half the price. We are family-owned, locally operated, and we know our customers by name." },
        ],
      },
    });
    written.push("about-content");

    // Contact Page
    await payload.updateGlobal({
      slug: "contact-info",
      data: {
        badge: "Contact",
        headline: "We're here to help you save",
        subheadline:
          "Visit our Limassol showroom or reach out online. Our appliance specialists respond within 2 hours.",
      },
    });
    written.push("contact-info");

    // Announcement Bar
    await payload.updateGlobal({
      slug: "announcement-bar",
      data: {
        enabled: true,
        message: "Spring Sale - Up to 70% off premium open box appliances. Limited stock!",
        ctaLabel: "Shop Now",
        ctaHref: "/products",
      },
    });
    written.push("announcement-bar");

    // Stats Section
    await payload.updateGlobal({
      slug: "stats",
      data: {
        eyebrow: "Our Impact",
        title: "Numbers That Tell the Story",
        items: [
          { value: 12, suffix: "+", label: "Years in Business" },
          { value: 5000, suffix: "+", label: "Happy Customers" },
          { value: 50, suffix: "+", label: "Premium Brands" },
          { value: 70, suffix: "%", label: "Max Savings" },
        ],
      },
    });
    written.push("stats");

    // Services Section
    await payload.updateGlobal({
      slug: "services-section",
      data: {
        eyebrow: "What We Do",
        title: "Premium Services Included",
        subtitle:
          "From sourcing to installation - we handle everything so you get a worry-free open box experience.",
        items: [
          { icon: "Search",   title: "Direct Sourcing",  description: "We source directly from manufacturer overstock, customer returns, and display models.", price: "FREE", badge: "Most Popular" },
          { icon: "Wrench",   title: "47-Point Inspection", description: "Every appliance goes through a rigorous inspection before it reaches you." },
          { icon: "Settings", title: "Pro Installation",    description: "Optional installation by our certified Cyprus technicians.", price: "From €49" },
          { icon: "Package",  title: "Free Delivery",       description: "Island-wide delivery within 48 hours of purchase." },
        ],
      },
    });
    written.push("services-section");

    // Testimonials Section
    await payload.updateGlobal({
      slug: "testimonials-section",
      data: {
        eyebrow: "Customer Stories",
        title: "Thousands of Happy Families",
        subtitle:
          "Real reviews from real customers who saved big without compromising quality.",
        items: [
          { content: "Saved over €800 on a Samsung fridge. Looks brand new and works perfectly. Michael's team installed it the next day.", name: "Maria Papadopoulou", role: "Homeowner", location: "Limassol", rating: 5 },
          { content: "Professional service from start to finish. The 47-point inspection report gave me total confidence. Best appliance buy I've ever made.", name: "Andreas Constantinou", role: "Homeowner", location: "Nicosia", rating: 5 },
          { content: "We furnished our entire holiday rental through Lamidis - six appliances, all premium brands, half the price of retail.", name: "Eleni Stavrou", role: "Business Owner", location: "Paphos", rating: 5 },
          { content: "The Bosch dishwasher I bought has been running flawlessly for two years. Open box was the smartest decision.", name: "Christos Georgiou", role: "Homeowner", location: "Larnaca", rating: 5 },
          { content: "Free delivery to Famagusta, professional installation, full warranty. They go above and beyond.", name: "Sophia Markou", role: "Homeowner", location: "Famagusta", rating: 5 },
        ],
      },
    });
    written.push("testimonials-section");

    // FAQ Section
    await payload.updateGlobal({
      slug: "faq-section",
      data: {
        eyebrow: "Questions",
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know before buying open box appliances in Cyprus.",
        items: [
          { question: "What is an 'open box' appliance?", answer: "Open box appliances are products that have been opened but never used - typically customer returns, display models, or overstock. Every unit we sell is inspected and certified to be like-new." },
          { question: "Do you offer a warranty?",          answer: "Yes. Every appliance comes with a 12-month Lamidis warranty covering parts and labour, valid anywhere in Cyprus." },
          { question: "Do you deliver across Cyprus?",     answer: "Yes - free delivery anywhere in Cyprus within 48 hours of purchase. Limassol, Nicosia, Larnaca, Paphos, Famagusta." },
          { question: "Can I return a product?",           answer: "You have 14 days to return any product for a full refund, no questions asked." },
          { question: "Do you offer installation?",        answer: "Yes. Professional installation is available for €49 by our certified technicians. Free for orders over €1000." },
          { question: "What payment methods do you accept?", answer: "Cash, all major credit cards, and bank transfer. We also offer 0% interest financing on orders over €500." },
        ],
      },
    });
    written.push("faq-section");

    // Trust Badges
    await payload.updateGlobal({
      slug: "trust-badges",
      data: {
        eyebrow: "Trusted by Thousands",
        title: "Why Families Choose Lamidis",
        items: [
          { icon: "ShieldCheck", title: "47-Point Inspection",       description: "Every appliance passes our rigorous certification process before reaching you." },
          { icon: "Award",       title: "12-Month Lamidis Warranty", description: "Full coverage on parts and labour, valid island-wide." },
          { icon: "Truck",       title: "Free Cyprus Delivery",      description: "Island-wide delivery within 48 hours, free for orders over €299." },
          { icon: "RefreshCw",   title: "14-Day Returns",            description: "Not happy? Return it within 14 days for a full refund." },
        ],
      },
    });
    written.push("trust-badges");

    // Features Section
    await payload.updateGlobal({
      slug: "features-section",
      data: {
        eyebrow: "Why Open Box?",
        title: "The Smart Way to Buy Premium Appliances",
        subtitle: "Open box means like-new quality at a fraction of retail. Discover why thousands of Cypriot families choose Lamidis.",
        items: [
          { icon: "Tag",            title: "Up to 70% Off",        description: "Save thousands on premium brands with our certified open box inventory." },
          { icon: "CheckCircle2",   title: "Like-New Quality",     description: "47-point inspection. Every product is certified, cleaned, and tested." },
          { icon: "Zap",            title: "Latest Models",        description: "Current-year stock with the same features as full-priced retail." },
          { icon: "Recycle",        title: "Eco-Friendly Choice",  description: "Reduce electronic waste by giving open box units a great new home." },
          { icon: "Star",           title: "Cyprus #1 Open Box",   description: "5,000+ happy households trust Michael Lamidis for their appliances." },
          { icon: "HeartHandshake", title: "Personal Service",     description: "Family-owned, locally operated - we know our customers by name." },
        ],
      },
    });
    written.push("features-section");

    // Category Strip
    await payload.updateGlobal({
      slug: "category-strip",
      data: {
        eyebrow: "Shop by Category",
        items: [
          { id: "all",              label: "All Products" },
          { id: "refrigerators",    label: "Refrigerators" },
          { id: "washing-machines", label: "Washing Machines" },
          { id: "ovens",            label: "Ovens" },
          { id: "dishwashers",      label: "Dishwashers" },
          { id: "air-conditioners", label: "Air Conditioning" },
          { id: "tvs",              label: "Smart TVs" },
          { id: "small-appliances", label: "Small Appliances" },
        ],
      },
    });
    written.push("category-strip");

    // Navigation
    await payload.updateGlobal({
      slug: "navigation",
      data: {
        items: [
          { label: "Home",         href: "/" },
          { label: "Products",     href: "/products" },
          { label: "About",        href: "/about" },
          { label: "Testimonials", href: "/testimonials" },
          { label: "Blog",         href: "/blog" },
          { label: "Contact",      href: "/contact" },
        ],
        getQuoteLabel: "Get a Quote",
        getQuoteHref: "/contact",
      },
    });
    written.push("navigation");

    // Lead Capture
    await payload.updateGlobal({
      slug: "lead-capture",
      data: {
        eyebrow: "Get the Best Deal",
        title: "Tell us what you're looking for",
        subtitle:
          "Share your needs and we'll find the perfect certified unit at the best possible price - response within 2 hours.",
        benefits: [
          { text: "Response within 2 hours" },
          { text: "No-obligation quote" },
          { text: "Price-match guarantee" },
          { text: "Expert recommendations" },
        ],
      },
    });
    written.push("lead-capture");

    // Footer
    await payload.updateGlobal({
      slug: "footer",
      data: {
        description:
          "Cyprus's premier destination for certified open box appliances. Quality you can trust, savings you'll love.",
        copyright: "Michael Lamidis. All rights reserved.",
        companyLinks: [
          { label: "About Us",     href: "/about" },
          { label: "Our Services", href: "/services" },
          { label: "Testimonials", href: "/testimonials" },
          { label: "Blog",         href: "/blog" },
        ],
        servicesLinks: [
          { label: "Delivery",     href: "/services" },
          { label: "Installation", href: "/services" },
          { label: "Warranty",     href: "/services" },
          { label: "Returns",      href: "/services" },
        ],
      },
    });
    written.push("footer");

    // Contact Section
    await payload.updateGlobal({
      slug: "contact-section",
      data: {
        eyebrow: "Get in Touch",
        title: "We're Here to Help",
        subtitle:
          "Visit our Limassol showroom or reach out online. Our appliance specialists are ready to find you the perfect open box deal.",
        addressLabel: "Address",
        phoneLabel: "Phone",
        emailLabel: "Email",
        hoursLabel: "Hours",
        mapCta: "Get Directions",
      },
    });
    written.push("contact-section");

    return NextResponse.json({
      ok: true,
      message: "All 16 globals seeded with Michael Lamidis sample data.",
      written,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err), stack: err instanceof Error ? err.stack : undefined },
      { status: 500 },
    );
  }
}
