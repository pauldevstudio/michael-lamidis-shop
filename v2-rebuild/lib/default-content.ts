/**
 * Premium default copy for SiteContent. Shared by:
 *  - lib/content.ts  (fallback when DB is empty)
 *  - scripts/seed.ts (initial DB document)
 *
 * Copy is benefit-led and conversion-focused, not feature-led.
 */
import type { SiteContent } from "@/types";

export const DEFAULT_CONTENT: SiteContent = {
  business: {
    name: "Michael Lamidis",
    tagline: "Premium appliances. Open box prices.",
    description:
      "Cyprus's most trusted open box appliance destination. Premium brands at 30–70% off retail, certified by our 47-point inspection.",
    phone: "+357 25 123 456",
    email: "info@michaellamidis.com.cy",
    address: "123 Makarios Avenue, Limassol 3025",
    hours: "Mon–Sat · 09:00 – 20:00",
  },
  hero: {
    badge: "Cyprus's #1 Open Box Destination",
    headline: "Premium appliances, without the premium price.",
    subheadline:
      "Hand-inspected Samsung, Bosch, Miele and more — backed by a 12-month warranty and delivered across Cyprus.",
    ctaPrimary: "Shop the catalog",
    ctaSecondary: "Visit the showroom",
  },
  about: {
    headline: "Built on trust, run by family.",
    body: "Since 2014, every appliance in our Limassol showroom has passed a 47-point inspection before reaching your home — that's why thousands of Cypriots choose us instead of paying retail.",
  },
  cta: {
    headline: "Ready to save without sacrificing quality?",
    subheadline:
      "Visit our Limassol showroom or browse the catalog — every appliance is inspected, warrantied and ready to ship.",
    ctaPrimary: "Browse catalog",
    ctaSecondary: "Call +357 25 123 456",
  },
  stats: [
    { label: "Happy customers", value: "5,000+" },
    { label: "Brands carried", value: "25+" },
    { label: "Avg. savings", value: "30–70%" },
    { label: "Delivery", value: "All Cyprus" },
  ],
  brands: [
    { name: "Samsung" },
    { name: "Bosch" },
    { name: "Miele" },
    { name: "LG" },
    { name: "Siemens" },
    { name: "Whirlpool" },
    { name: "AEG" },
    { name: "Beko" },
  ],
  features: [
    {
      icon: "shield-check",
      title: "47-point inspection",
      body: "Every appliance is tested, cleaned and certified by our technicians before it hits the showroom floor.",
    },
    {
      icon: "badge-check",
      title: "12-month warranty",
      body: "Our Lamidis warranty covers parts, labour and on-site visits — no fine print, no fuss.",
    },
    {
      icon: "truck",
      title: "Free Cyprus delivery",
      body: "Orders over €500 ship free island-wide, with old-appliance removal available on request.",
    },
    {
      icon: "headphones",
      title: "Human support",
      body: "Speak directly with the family running the shop — by phone, WhatsApp or in the showroom.",
    },
  ],
  categories: [
    { name: "Refrigeration", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800", tagline: "Fridges, freezers, wine coolers" },
    { name: "Cooking", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", tagline: "Ovens, hobs, range hoods" },
    { name: "Laundry", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800", tagline: "Washers, dryers, combos" },
    { name: "Dishwashers", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800", tagline: "Full-size and slimline" },
  ],
  process: [
    { title: "Browse", body: "Filter our catalog by brand, category or savings — every item shows its condition and warranty up front." },
    { title: "Inspect", body: "Pop into our Limassol showroom or request photos and a video walkaround for any appliance." },
    { title: "Reserve", body: "Lock in your pick with a quick deposit, or pay in full to start the delivery clock." },
    { title: "Enjoy", body: "Free delivery across Cyprus, optional installation, and a 12-month warranty from day one." },
  ],
  testimonials: [
    { quote: "Saved €700 on a Miele washing machine. Showed up in perfect condition with the warranty card already filled in. Couldn't ask for more.", name: "Andreas P.", city: "Nicosia" },
    { quote: "The team walked me through the exact difference between three Bosch dishwashers over WhatsApp. That kind of service is rare.", name: "Maria K.", city: "Limassol" },
    { quote: "Fitted out the whole kitchen for the price of a single new fridge at the big box stores. The 12-month warranty sealed it.", name: "Christos D.", city: "Paphos" },
  ],
  pricing: [
    {
      name: "Compact",
      tagline: "Studios & small kitchens",
      savings: "from −30%",
      highlights: ["Slimline dishwashers", "Under-counter fridges", "Combo washer-dryers", "12-month warranty included"],
    },
    {
      name: "Family",
      tagline: "The most popular tier",
      savings: "from −45%",
      highlights: ["French-door fridges", "Full-size ovens", "9kg+ washers", "Free Cyprus delivery", "12-month warranty included"],
      featured: true,
    },
    {
      name: "Premium",
      tagline: "Miele, Smeg, Liebherr",
      savings: "from −55%",
      highlights: ["Top-tier brands", "Built-in solutions", "Concierge installation", "12-month warranty included"],
    },
  ],
  faqs: [
    { question: "What does 'open box' actually mean?", answer: "Open box appliances are returns, display units or pieces with light cosmetic flaws. They are mechanically tested, cleaned and certified to look and perform as new." },
    { question: "Is the warranty the same as new?", answer: "Yes — our 12-month Lamidis warranty covers parts, labour and on-site visits, the same as you'd get from a major retailer." },
    { question: "Do you deliver across Cyprus?", answer: "We deliver island-wide. Orders over €500 ship free; smaller orders are quoted at checkout. Installation is available on request." },
    { question: "Can I see an appliance before buying?", answer: "Of course. Visit our Limassol showroom Monday to Saturday, 09:00–20:00, or request a video walkaround over WhatsApp." },
    { question: "What if something goes wrong?", answer: "Call or WhatsApp us — same-day response in working hours. Within the warranty period, repairs and parts are on us." },
  ],
  updatedAt: new Date().toISOString(),
};
