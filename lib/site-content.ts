import fs from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import {
  SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION,
  SITE_PHONE, SITE_EMAIL, SITE_ADDRESS, SITE_HOURS,
  SOCIAL_LINKS, FEATURED_PRODUCTS, type Product,
} from "./constants";

// ─── Types ────────────────────────────────────────────────────────

export interface BusinessInfo {
  name: string; tagline: string; description: string;
  phone: string; email: string; address: string; hours: string;
  social: { facebook: string; instagram: string; youtube: string };
}
export interface HeroContent {
  badge: string;
  headline: string;
  subheadline: string;
  locationLabel?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}
export interface AboutContent   { headline: string; subheadline: string; story: string[] }
export interface StatsContent   { customers: string; brands: string; savings: string; cities: string }
export interface ThemeContent   { primaryColor: string; accentColor: string; fontHeading: string; fontBody: string }
export interface ContactContent { badge: string; headline: string; subheadline: string }
export interface ServiceItem { icon: string; title: string; description: string; price?: string; badge?: string }
export interface ServicesContent { eyebrow: string; title: string; subtitle: string; items: ServiceItem[] }
export interface TestimonialItem { quote: string; author: string; role?: string; location?: string; rating: number }
export interface TestimonialsContent { eyebrow: string; title: string; subtitle: string; items: TestimonialItem[] }
export interface FaqItem { question: string; answer: string }
export interface FaqContent { eyebrow: string; title: string; subtitle: string; items: FaqItem[] }
export interface StatItem { value: number; suffix: string; label: string }
export interface StatsSectionContent { eyebrow: string; title: string; items: StatItem[] }
export interface TestimonialItemFull { content: string; name: string; role?: string; location?: string; rating: number }
export interface TestimonialsSectionContent { eyebrow: string; title: string; subtitle: string; items: TestimonialItemFull[] }
export interface AnnouncementContent { enabled: boolean; message: string; ctaLabel: string; ctaHref: string }
export interface TrustItem { icon: string; title: string; description: string }
export interface TrustBadgesContent { eyebrow: string; title: string; items: TrustItem[] }
export interface FeatureItem { icon: string; title: string; description: string }
export interface FeaturesContent { eyebrow: string; title: string; subtitle: string; items: FeatureItem[] }
export interface CategoryItem { id: string; label: string }
export interface CategoryStripContent { eyebrow: string; items: CategoryItem[] }
export interface NavLink { label: string; href: string }
export interface NavigationContent { items: NavLink[]; getQuoteLabel: string; getQuoteHref: string }
export interface LeadCaptureContent { eyebrow: string; title: string; subtitle: string; benefits: string[] }
export interface FooterContent { description: string; copyright: string; companyLinks: NavLink[]; servicesLinks: NavLink[] }
export interface ContactSectionContent {
  eyebrow: string; title: string; subtitle: string;
  addressLabel: string; phoneLabel: string; emailLabel: string; hoursLabel: string; mapCta: string;
}
export interface SeoPage        { title: string; description: string }
export interface SiteContent {
  business: BusinessInfo; hero: HeroContent; about: AboutContent;
  stats: StatsContent; theme: ThemeContent;
  seo: Record<string, SeoPage>; products: Product[];
  contact: ContactContent;
  services: ServicesContent;
  testimonials: TestimonialsContent;
  faq: FaqContent;
  statsSection: StatsSectionContent;
  testimonialsSection: TestimonialsSectionContent;
  announcement: AnnouncementContent;
  trustBadges: TrustBadgesContent;
  features: FeaturesContent;
  categoryStrip: CategoryStripContent;
  navigation: NavigationContent;
  leadCapture: LeadCaptureContent;
  footer: FooterContent;
  contactSection: ContactSectionContent;
}

// ─── Defaults ─────────────────────────────────────────────────────

export const DEFAULT_CONTENT: SiteContent = {
  business: {
    name: SITE_NAME, tagline: SITE_TAGLINE, description: SITE_DESCRIPTION,
    phone: SITE_PHONE, email: SITE_EMAIL, address: SITE_ADDRESS, hours: SITE_HOURS,
    social: { facebook: SOCIAL_LINKS.facebook, instagram: SOCIAL_LINKS.instagram, youtube: SOCIAL_LINKS.youtube },
  },
  hero: {
    badge: "Cyprus's #1 Open Box Destination",
    headline: "Premium Appliances.\nOpen Box Prices.",
    subheadline: "Every item certified, warranted & delivered across Cyprus.",
    locationLabel: "Limassol, Cyprus",
    primaryCtaLabel: "Browse Products",
    primaryCtaHref: "/products",
    secondaryCtaLabel: "View Collection",
    secondaryCtaHref: "/products",
  },
  about: {
    headline: "How Cyprus Buys Smart",
    subheadline: "The story behind Michael Lamidis Open Box Shop",
    story: [
      "Michael Lamidis started as a single showroom in Limassol with a simple belief: every Cypriot household deserves access to premium appliances without the premium price tag.",
      "What began as a passion for quality has grown into Cyprus's most trusted open box destination. Every item in our store goes through a rigorous 47-point inspection before it reaches you.",
      "Today, thousands of satisfied customers across Cyprus enjoy premium brands like Samsung, Bosch, LG, and Miele at a fraction of the retail price — backed by our 12-month Lamidis warranty.",
    ],
  },
  stats:   { customers: "5,000+", brands: "25+", savings: "30–70%", cities: "All Cyprus" },
  contact: {
    badge: "Contact",
    headline: "We're Here to Help You Save",
    subheadline: "Visit our Limassol showroom or contact us online. Our specialists respond within 2 hours.",
  },
  services: {
    eyebrow: "What We Do",
    title: "Premium Services",
    subtitle: "From sourcing to installation - we handle everything so you get a worry-free open box experience.",
    items: [
      { icon: "Search",   title: "Sourcing",      description: "We source directly from manufacturer overstock and returns.", price: "FREE",  badge: "Most Popular" },
      { icon: "Wrench",   title: "Inspection",    description: "47-point inspection on every appliance before it reaches you." },
      { icon: "Settings", title: "Installation",  description: "Pro install by our certified technicians.", price: "From \u20ac49" },
      { icon: "Package",  title: "Free Delivery", description: "Island-wide delivery within 48 hours of purchase." },
    ],
  },
  testimonials: {
    eyebrow: "Customer Stories",
    title: "What Cyprus Says About Us",
    subtitle: "Thousands of households trust Michael Lamidis with their appliance needs.",
    items: [
      { quote: "Saved over \u20ac800 on my fridge. Looks brand new and works perfectly.", author: "Maria K.", location: "Limassol", rating: 5 },
      { quote: "Professional installation, fair prices. I recommend them to everyone.",  author: "Andreas P.", location: "Nicosia",  rating: 5 },
      { quote: "Excellent customer service from start to finish. Will buy again.",       author: "Eleni S.",   location: "Larnaca",  rating: 5 },
    ],
  },
  statsSection: {
    eyebrow: "Our Impact",
    title: "Numbers That Tell the Story",
    items: [
      { value: 12,   suffix: "+", label: "Years in Business" },
      { value: 5000, suffix: "+", label: "Happy Customers" },
      { value: 50,   suffix: "+", label: "Premium Brands" },
      { value: 70,   suffix: "%", label: "Max Savings" },
    ],
  },
  testimonialsSection: {
    eyebrow: "Customer Stories",
    title: "Thousands of Happy Families",
    subtitle: "Real reviews from real customers who saved big without compromising quality.",
    items: [
      { content: "Saved over \u20ac800 on my fridge. Looks brand new and works perfectly.", name: "Maria K.",    role: "Homeowner", location: "Limassol", rating: 5 },
      { content: "Professional installation, fair prices. I recommend them to everyone.",    name: "Andreas P.", role: "Homeowner", location: "Nicosia",  rating: 5 },
      { content: "Excellent customer service from start to finish. Will buy again.",         name: "Eleni S.",   role: "Homeowner", location: "Larnaca",  rating: 5 },
    ],
  },
  announcement: {
    enabled: true,
    message: "Summer Sale - Up to 70% off premium open box appliances. Limited stock!",
    ctaLabel: "Shop Now",
    ctaHref: "/products",
  },
  trustBadges: {
    eyebrow: "Trusted by Thousands",
    title: "Why Families Choose Lamidis",
    items: [
      { icon: "ShieldCheck", title: "47-Point Inspection",      description: "Every appliance passes our rigorous certification process before reaching you." },
      { icon: "Award",       title: "12-Month Lamidis Warranty", description: "Full coverage on parts and labour, island-wide." },
      { icon: "Truck",       title: "Free Cyprus Delivery",     description: "Island-wide delivery within 48 hours, free for orders over EUR 299." },
      { icon: "RefreshCw",   title: "14-Day Returns",           description: "Not happy? Return it within 14 days for a full refund." },
    ],
  },
  features: {
    eyebrow: "Why Open Box?",
    title: "The Smart Way to Buy Premium Appliances",
    subtitle: "Open box means like-new quality at a fraction of retail.",
    items: [
      { icon: "Tag",            title: "Up to 70% Off",       description: "Save thousands on premium brands with our certified open box inventory." },
      { icon: "CheckCircle2",   title: "Like-New Quality",    description: "47-point inspection. Every product is certified, cleaned, and tested." },
      { icon: "Zap",            title: "Latest Models",       description: "Current-year stock - same features as full-priced retail." },
      { icon: "Recycle",        title: "Eco-Friendly Choice", description: "Reduce electronic waste by giving open-box units a great new home." },
      { icon: "Star",           title: "Cyprus #1 Open Box",  description: "5,000+ happy households trust Michael Lamidis for their appliances." },
      { icon: "HeartHandshake", title: "Personal Service",    description: "Family-owned, locally operated - we know our customers by name." },
    ],
  },
  categoryStrip: {
    eyebrow: "Shop by Category",
    items: [
      { id: "all",               label: "All Products" },
      { id: "refrigerators",     label: "Refrigerators" },
      { id: "washing-machines",  label: "Washers" },
      { id: "ovens",             label: "Ovens" },
      { id: "dishwashers",       label: "Dishwashers" },
      { id: "air-conditioners",  label: "Air Conditioning" },
      { id: "tvs",               label: "TVs" },
      { id: "small-appliances",  label: "Small Appliances" },
    ],
  },
  navigation: {
    items: [
      { label: "Home",         href: "/" },
      { label: "Products",     href: "/products" },
      { label: "About",        href: "/about" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blog",         href: "/blog" },
      { label: "Contact",      href: "/contact" },
    ],
    getQuoteLabel: "Get a Quote",
    getQuoteHref:  "/contact",
  },
  leadCapture: {
    eyebrow:  "Get the Best Deal",
    title:    "Tell Us What You're Looking For",
    subtitle: "Share your needs and we'll find the perfect certified unit at the best possible price - response within 2 hours.",
    benefits: [
      "Response within 2 hours",
      "No-obligation quote",
      "Price-match guarantee",
      "Expert recommendations",
    ],
  },
  footer: {
    description: "Cyprus's premier destination for certified open box appliances. Quality you can trust, savings you'll love.",
    copyright:   "Michael Lamidis. All rights reserved.",
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
  contactSection: {
    eyebrow:      "Get in Touch",
    title:        "We're Here to Help",
    subtitle:     "Visit our Limassol showroom or reach out online. Our appliance specialists are ready.",
    addressLabel: "Address",
    phoneLabel:   "Phone",
    emailLabel:   "Email",
    hoursLabel:   "Hours",
    mapCta:       "Get Directions",
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know before you buy.",
    items: [
      { question: "What is an 'open box' appliance?", answer: "Open box appliances are products that have been opened but never used - typically customer returns, display models, or overstock. Every unit we sell is inspected and certified." },
      { question: "Do you offer a warranty?",         answer: "Yes. Every appliance comes with a minimum 12-month Lamidis warranty covering parts and labour." },
      { question: "Do you deliver across Cyprus?",    answer: "Yes - free delivery anywhere in Cyprus within 48 hours of purchase." },
      { question: "Can I return a product?",          answer: "You have 14 days to return any product for a full refund, no questions asked." },
    ],
  },
  theme:   { primaryColor: "#3A5F8A", accentColor: "#1E48B8", fontHeading: "Plus Jakarta Sans", fontBody: "Inter" },
  seo: {
    "/":             { title: `${SITE_NAME} | Open Box Appliances Cyprus`, description: SITE_DESCRIPTION },
    "/about":        { title: `About ${SITE_NAME}`, description: `Learn the story behind ${SITE_NAME} — Cyprus's most trusted open box appliance destination.` },
    "/products":     { title: `All Products | ${SITE_NAME}`, description: "Browse certified open box appliances from Samsung, Bosch, LG, Miele and more." },
    "/contact":      { title: `Contact | ${SITE_NAME}`, description: "Visit our Limassol showroom or get in touch." },
    "/blog":         { title: `Blog | ${SITE_NAME}`, description: "Tips, guides and expert advice on buying open box appliances in Cyprus." },
    "/faq":          { title: `FAQ | ${SITE_NAME}`, description: "Answers to your questions about open box appliances, warranties, delivery and returns." },
    "/services":     { title: `Services | ${SITE_NAME}`, description: `Delivery, installation, warranty and inspection services from ${SITE_NAME}.` },
    "/testimonials": { title: `Testimonials | ${SITE_NAME}`, description: `See what thousands of satisfied customers say about ${SITE_NAME}.` },
  },
  products: FEATURED_PRODUCTS,
};

// ─── Helpers ──────────────────────────────────────────────────────

const DATA_PATH = path.join(process.cwd(), "data", "site-content.json");

function mergeDefaults(parsed: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_CONTENT, ...parsed,
    business: { ...DEFAULT_CONTENT.business, ...parsed.business },
    hero:     { ...DEFAULT_CONTENT.hero,     ...parsed.hero },
    about:    { ...DEFAULT_CONTENT.about,    ...parsed.about },
    stats:    { ...DEFAULT_CONTENT.stats,    ...parsed.stats },
    contact:  { ...DEFAULT_CONTENT.contact,  ...parsed.contact },
    services:     parsed.services     ? { ...DEFAULT_CONTENT.services,     ...parsed.services }     : DEFAULT_CONTENT.services,
    testimonials: parsed.testimonials ? { ...DEFAULT_CONTENT.testimonials, ...parsed.testimonials } : DEFAULT_CONTENT.testimonials,
    faq:          parsed.faq          ? { ...DEFAULT_CONTENT.faq,          ...parsed.faq }          : DEFAULT_CONTENT.faq,
    statsSection:        parsed.statsSection        ? { ...DEFAULT_CONTENT.statsSection,        ...parsed.statsSection }        : DEFAULT_CONTENT.statsSection,
    testimonialsSection: parsed.testimonialsSection ? { ...DEFAULT_CONTENT.testimonialsSection, ...parsed.testimonialsSection } : DEFAULT_CONTENT.testimonialsSection,
    announcement:        parsed.announcement        ? { ...DEFAULT_CONTENT.announcement,        ...parsed.announcement }        : DEFAULT_CONTENT.announcement,
    trustBadges:   parsed.trustBadges   ? { ...DEFAULT_CONTENT.trustBadges,   ...parsed.trustBadges }   : DEFAULT_CONTENT.trustBadges,
    features:      parsed.features      ? { ...DEFAULT_CONTENT.features,      ...parsed.features }      : DEFAULT_CONTENT.features,
    categoryStrip: parsed.categoryStrip ? { ...DEFAULT_CONTENT.categoryStrip, ...parsed.categoryStrip } : DEFAULT_CONTENT.categoryStrip,
    navigation:     parsed.navigation     ? { ...DEFAULT_CONTENT.navigation,     ...parsed.navigation }     : DEFAULT_CONTENT.navigation,
    leadCapture:    parsed.leadCapture    ? { ...DEFAULT_CONTENT.leadCapture,    ...parsed.leadCapture }    : DEFAULT_CONTENT.leadCapture,
    footer:         parsed.footer         ? { ...DEFAULT_CONTENT.footer,         ...parsed.footer }         : DEFAULT_CONTENT.footer,
    contactSection: parsed.contactSection ? { ...DEFAULT_CONTENT.contactSection, ...parsed.contactSection } : DEFAULT_CONTENT.contactSection,
    theme:    { ...DEFAULT_CONTENT.theme,    ...parsed.theme },
    seo:      { ...DEFAULT_CONTENT.seo,      ...parsed.seo },
    products: parsed.products?.length ? parsed.products : DEFAULT_CONTENT.products,
  };
}

function readFromFile(): SiteContent {
  try {
    const __raw = fs.readFileSync(DATA_PATH, "utf-8").replace(/\u0000+$/, "").trimEnd();
    return mergeDefaults(JSON.parse(__raw) as Partial<SiteContent>);
  } catch { return DEFAULT_CONTENT; }
}

// ─── Public API ───────────────────────────────────────────────────

const SITE_CONTENT_TAG = "site-content";

/**
 * Inner getter — does the actual MongoDB + Payload work.
 * Wrapped below in unstable_cache so admin pages reusing it within
 * a 30s window skip the ~17-query roundtrip. Save handlers call
 * revalidateTag("site-content") to bust this cache immediately.
 */
async function _getSiteContent(): Promise<SiteContent> {
  // 1. Start with the legacy source of truth (Mongo doc or JSON file).
  let base: SiteContent;
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB }       = await import("@/lib/db");
      const { SiteContentModel } = await import("@/lib/models");
      await connectDB();
      const doc = await SiteContentModel.findOne({ key: "site" }).lean();
      if (doc?.data) {
        base = mergeDefaults(doc.data as Partial<SiteContent>);
      } else {
        const seed = readFromFile();
        await SiteContentModel.create({ key: "site", data: seed });
        base = seed;
      }
    } catch (err) {
      console.error("[MongoDB] getSiteContent failed, falling back to file:", err);
      base = readFromFile();
    }
  } else {
    base = readFromFile();
  }

  // 2. Overlay Payload's business-info global on top of base.business.
  //    If Payload isn't reachable or empty, base wins — site keeps working.
  try {
    const { getPayload } = await import("payload");
    const { default: payloadConfig } = await import("@payload-config");
    const payload = await getPayload({ config: payloadConfig });

    // Fire ALL Payload reads in parallel. Each `await pXxx` below resolves
    // as soon as its single query returns — total time becomes max(query),
    // not sum. Cuts admin/dashboard from ~17 * ~80ms to ~150ms.
    const pHomeHero      = payload.findGlobal({ slug: "home-hero" }).catch((e) => { console.error("[Payload] home-hero failed:", e); return null; });
    const pAbout         = payload.findGlobal({ slug: "about-content" }).catch((e) => { console.error("[Payload] about-content failed:", e); return null; });
    const pContactInfo   = payload.findGlobal({ slug: "contact-info" }).catch((e) => { console.error("[Payload] contact-info failed:", e); return null; });
    const pStats         = payload.findGlobal({ slug: "stats" }).catch((e) => { console.error("[Payload] stats failed:", e); return null; });
    const pAnnouncement  = payload.findGlobal({ slug: "announcement-bar" }).catch((e) => { console.error("[Payload] announcement-bar failed:", e); return null; });
    const pTrustBadges   = payload.findGlobal({ slug: "trust-badges" }).catch((e) => { console.error("[Payload] trust-badges failed:", e); return null; });
    const pFeatures      = payload.findGlobal({ slug: "features-section" }).catch((e) => { console.error("[Payload] features failed:", e); return null; });
    const pCategoryStrip = payload.findGlobal({ slug: "category-strip" }).catch((e) => { console.error("[Payload] category-strip failed:", e); return null; });
    const pNavigation    = payload.findGlobal({ slug: "navigation" }).catch((e) => { console.error("[Payload] navigation failed:", e); return null; });
    const pLeadCapture   = payload.findGlobal({ slug: "lead-capture" }).catch((e) => { console.error("[Payload] lead-capture failed:", e); return null; });
    const pFooter        = payload.findGlobal({ slug: "footer" }).catch((e) => { console.error("[Payload] footer failed:", e); return null; });
    const pContactSec    = payload.findGlobal({ slug: "contact-section" }).catch((e) => { console.error("[Payload] contact-section failed:", e); return null; });
    const pServices      = payload.findGlobal({ slug: "services-section" }).catch((e) => { console.error("[Payload] services failed:", e); return null; });
    const pTestimonials  = payload.findGlobal({ slug: "testimonials-section" }).catch((e) => { console.error("[Payload] testimonials failed:", e); return null; });
    const pFaq           = payload.findGlobal({ slug: "faq-section" }).catch((e) => { console.error("[Payload] faq failed:", e); return null; });
    const pBusiness      = payload.findGlobal({ slug: "business-info" }).catch((e) => { console.error("[Payload] business-info failed:", e); return null; });
    const pProducts      = payload.find({ collection: "products", limit: 500, depth: 1, sort: "displayOrder" }).catch((e) => { console.error("[Payload] products failed:", e); return { docs: [] } as { docs: Array<Record<string, unknown>> }; });

    // Home Hero global overlay
    try {
      const hh = await pHomeHero;
      if (hh && (hh as { headline?: string }).headline) {
        const h = hh as Record<string, unknown>;
        base = {
          ...base,
          hero: {
            badge:             (h.badge as string)             ?? base.hero.badge,
            headline:          (h.headline as string)          ?? base.hero.headline,
            subheadline:       (h.subheadline as string)       ?? base.hero.subheadline,
            locationLabel:     (h.locationLabel as string)     ?? base.hero.locationLabel,
            primaryCtaLabel:   (h.primaryCtaLabel as string)   ?? base.hero.primaryCtaLabel,
            primaryCtaHref:    (h.primaryCtaHref as string)    ?? base.hero.primaryCtaHref,
            secondaryCtaLabel: (h.secondaryCtaLabel as string) ?? base.hero.secondaryCtaLabel,
            secondaryCtaHref:  (h.secondaryCtaHref as string)  ?? base.hero.secondaryCtaHref,
          },
        };
      }
    } catch (err) {
      console.error("[Payload] home-hero overlay failed:", err);
    }

    // About page overlay
    try {
      const ac = await pAbout;
      if (ac && (ac as { headline?: string }).headline) {
        const a = ac as Record<string, unknown>;
        const storyArr = Array.isArray(a.story)
          ? (a.story as Array<{ text?: string }>).map((p) => p?.text ?? "").filter(Boolean)
          : [];
        base = {
          ...base,
          about: {
            headline:    (a.headline as string)    ?? base.about.headline,
            subheadline: (a.subheadline as string) ?? base.about.subheadline,
            story:       storyArr.length ? storyArr : base.about.story,
          },
        };
      }
    } catch (err) {
      console.error("[Payload] about-content overlay failed:", err);
    }

    // Products collection overlay.
    // Strategy: take JSON/legacy products as the base list, then OVERRIDE or
    // APPEND with Payload products that are well-formed (have a model and a
    // sale price). Zombie docs from earlier sessions are silently dropped.
    try {
      const productsRes = await pProducts;
      const docs = (productsRes?.docs ?? []) as Array<Record<string, unknown>>;

      const valid = docs
        .filter((d) => {
          const model = (d.model as string) ?? "";
          const price = Number(d.salePrice ?? 0);
          return model.trim().length > 0 && price > 0;
        })
        .map((d) => ({
          id:            String(d.id ?? ""),
          brand:         (d.brand as string)         ?? "",
          model:         (d.model as string)         ?? "",
          category:      (d.category as string)      ?? "all",
          originalPrice: Number(d.originalPrice ?? 0),
          salePrice:     Number(d.salePrice ?? 0),
          savings:       Number(d.savings ?? 0),
          grade:         (d.grade as string)         ?? "A",
          warranty:      Number(d.warranty ?? 12),
          icon:          (d.icon as string)          ?? "Package",
          colorFrom:     (d.colorFrom as string)     ?? "#3A5F8A",
          colorTo:       (d.colorTo as string)       ?? "#7FAEDB",
          imageUrl:      (() => {
            const img = d.image as Record<string, unknown> | string | null | undefined;
            if (img && typeof img === "object" && typeof img.url === "string") return img.url;
            return (d.imageUrl as string) ?? "";
          })(),
          description:   (d.description as string)   ?? "",
          specs:         Array.isArray(d.specs)
            ? (d.specs as Array<{ label?: string; value?: string }>).map((s) => ({
                label: s?.label ?? "",
                value: s?.value ?? "",
              }))
            : [],
        }));

      if (valid.length > 0) {
        // Payload has products — use ONLY Payload data. Ignore JSON fallback.
        base = { ...base, products: valid };
      }
    } catch (err) {
      console.error("[Payload] products overlay failed:", err);
    }

    // Contact page overlay
    try {
      const ci = await pContactInfo;
      if (ci && (ci as { headline?: string }).headline) {
        const c = ci as Record<string, unknown>;
        base = {
          ...base,
          contact: {
            badge:       (c.badge as string)       ?? base.contact.badge,
            headline:    (c.headline as string)    ?? base.contact.headline,
            subheadline: (c.subheadline as string) ?? base.contact.subheadline,
          },
        };
      }
    } catch (err) {
      console.error("[Payload] contact-info overlay failed:", err);
    }

    // Stats section overlay
    try {
      const sg = await pStats;
      if (sg) {
        const s = sg as Record<string, unknown>;
        const items = Array.isArray(s.items)
          ? (s.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.label === "string" && (it.label as string).length > 0)
              .map((it) => ({
                value:  Number(it.value ?? 0),
                suffix: (it.suffix as string) ?? "",
                label:  (it.label as string)  ?? "",
              }))
          : [];
        base = {
          ...base,
          statsSection: {
            eyebrow: (s.eyebrow as string) ?? base.statsSection.eyebrow,
            title:   (s.title   as string) ?? base.statsSection.title,
            items:   items.length ? items : base.statsSection.items,
          },
        };
      }
    } catch (err) { console.error("[Payload] stats overlay failed:", err); }

    // Announcement bar overlay
    try {
      const ab = await pAnnouncement;
      if (ab) {
        const a = ab as Record<string, unknown>;
        base = {
          ...base,
          announcement: {
            enabled:  a.enabled !== false,
            message:  (a.message as string)  ?? base.announcement.message,
            ctaLabel: (a.ctaLabel as string) ?? base.announcement.ctaLabel,
            ctaHref:  (a.ctaHref as string)  ?? base.announcement.ctaHref,
          },
        };
      }
    } catch (err) { console.error("[Payload] announcement overlay failed:", err); }

    // Trust badges overlay
    try {
      const tb = await pTrustBadges;
      if (tb) {
        const t = tb as Record<string, unknown>;
        const items = Array.isArray(t.items)
          ? (t.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.title === "string" && (it.title as string).length > 0)
              .map((it) => ({
                icon:        (it.icon as string)        ?? "ShieldCheck",
                title:       (it.title as string)       ?? "",
                description: (it.description as string) ?? "",
              }))
          : [];
        base = {
          ...base,
          trustBadges: {
            eyebrow: (t.eyebrow as string) ?? base.trustBadges.eyebrow,
            title:   (t.title   as string) ?? base.trustBadges.title,
            items:   items.length ? items : base.trustBadges.items,
          },
        };
      }
    } catch (err) { console.error("[Payload] trust-badges overlay failed:", err); }

    // Features section overlay
    try {
      const fs2 = await pFeatures;
      if (fs2) {
        const f = fs2 as Record<string, unknown>;
        const items = Array.isArray(f.items)
          ? (f.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.title === "string" && (it.title as string).length > 0)
              .map((it) => ({
                icon:        (it.icon as string)        ?? "Tag",
                title:       (it.title as string)       ?? "",
                description: (it.description as string) ?? "",
              }))
          : [];
        base = {
          ...base,
          features: {
            eyebrow:  (f.eyebrow  as string) ?? base.features.eyebrow,
            title:    (f.title    as string) ?? base.features.title,
            subtitle: (f.subtitle as string) ?? base.features.subtitle,
            items:    items.length ? items : base.features.items,
          },
        };
      }
    } catch (err) { console.error("[Payload] features overlay failed:", err); }

    // Category strip overlay
    try {
      const cs = await pCategoryStrip;
      if (cs) {
        const c = cs as Record<string, unknown>;
        const items = Array.isArray(c.items)
          ? (c.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.id === "string" && (it.id as string).length > 0)
              .map((it) => ({
                id:    (it.id as string)    ?? "",
                label: (it.label as string) ?? "",
              }))
          : [];
        base = {
          ...base,
          categoryStrip: {
            eyebrow: (c.eyebrow as string) ?? base.categoryStrip.eyebrow,
            items:   items.length ? items : base.categoryStrip.items,
          },
        };
      }
    } catch (err) { console.error("[Payload] category-strip overlay failed:", err); }

    // Navigation overlay
    try {
      const ng = await pNavigation;
      if (ng) {
        const n = ng as Record<string, unknown>;
        const items = Array.isArray(n.items)
          ? (n.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.label === "string" && (it.label as string).length > 0)
              .map((it) => ({ label: (it.label as string) ?? "", href: (it.href as string) ?? "/" }))
          : [];
        base = {
          ...base,
          navigation: {
            items:         items.length ? items : base.navigation.items,
            getQuoteLabel: (n.getQuoteLabel as string) ?? base.navigation.getQuoteLabel,
            getQuoteHref:  (n.getQuoteHref as string)  ?? base.navigation.getQuoteHref,
          },
        };
      }
    } catch (err) { console.error("[Payload] navigation overlay failed:", err); }

    // Lead capture overlay
    try {
      const lc = await pLeadCapture;
      if (lc) {
        const l = lc as Record<string, unknown>;
        const benefits = Array.isArray(l.benefits)
          ? (l.benefits as Array<Record<string, unknown>>)
              .map((b) => (b.text as string) ?? "")
              .filter((t) => t.length > 0)
          : [];
        base = {
          ...base,
          leadCapture: {
            eyebrow:  (l.eyebrow  as string) ?? base.leadCapture.eyebrow,
            title:    (l.title    as string) ?? base.leadCapture.title,
            subtitle: (l.subtitle as string) ?? base.leadCapture.subtitle,
            benefits: benefits.length ? benefits : base.leadCapture.benefits,
          },
        };
      }
    } catch (err) { console.error("[Payload] lead-capture overlay failed:", err); }

    // Footer overlay
    try {
      const fg = await pFooter;
      if (fg) {
        const f = fg as Record<string, unknown>;
        const mapLinks = (arr: unknown): Array<{ label: string; href: string }> =>
          Array.isArray(arr)
            ? (arr as Array<Record<string, unknown>>)
                .filter((it) => typeof it.label === "string" && (it.label as string).length > 0)
                .map((it) => ({ label: (it.label as string) ?? "", href: (it.href as string) ?? "/" }))
            : [];
        const cl = mapLinks(f.companyLinks);
        const sl = mapLinks(f.servicesLinks);
        base = {
          ...base,
          footer: {
            description:  (f.description as string) ?? base.footer.description,
            copyright:    (f.copyright as string)   ?? base.footer.copyright,
            companyLinks:  cl.length ? cl : base.footer.companyLinks,
            servicesLinks: sl.length ? sl : base.footer.servicesLinks,
          },
        };
      }
    } catch (err) { console.error("[Payload] footer overlay failed:", err); }

    // Contact section overlay
    try {
      const csec = await pContactSec;
      if (csec) {
        const c = csec as Record<string, unknown>;
        base = {
          ...base,
          contactSection: {
            eyebrow:      (c.eyebrow as string)      ?? base.contactSection.eyebrow,
            title:        (c.title as string)        ?? base.contactSection.title,
            subtitle:     (c.subtitle as string)     ?? base.contactSection.subtitle,
            addressLabel: (c.addressLabel as string) ?? base.contactSection.addressLabel,
            phoneLabel:   (c.phoneLabel as string)   ?? base.contactSection.phoneLabel,
            emailLabel:   (c.emailLabel as string)   ?? base.contactSection.emailLabel,
            hoursLabel:   (c.hoursLabel as string)   ?? base.contactSection.hoursLabel,
            mapCta:       (c.mapCta as string)       ?? base.contactSection.mapCta,
          },
        };
      }
    } catch (err) { console.error("[Payload] contact-section overlay failed:", err); }

    // Services overlay
    try {
      const sv = await pServices;
      if (sv) {
        const s = sv as Record<string, unknown>;
        const items = Array.isArray(s.items)
          ? (s.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.title === "string" && (it.title as string).length > 0)
              .map((it) => ({
                icon:        (it.icon as string)        ?? "Package",
                title:       (it.title as string)       ?? "",
                description: (it.description as string) ?? "",
                price:       (it.price as string)       ?? undefined,
                badge:       (it.badge as string)       ?? undefined,
              }))
          : [];
        base = {
          ...base,
          services: {
            eyebrow:  (s.eyebrow  as string) ?? base.services.eyebrow,
            title:    (s.title    as string) ?? base.services.title,
            subtitle: (s.subtitle as string) ?? base.services.subtitle,
            items:    items.length ? items : base.services.items,
          },
        };
      }
    } catch (err) { console.error("[Payload] services overlay failed:", err); }

    // Testimonials section overlay
    try {
      const tg = await pTestimonials;
      if (tg) {
        const t = tg as Record<string, unknown>;
        const items = Array.isArray(t.items)
          ? (t.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.content === "string" && (it.content as string).length > 0)
              .map((it) => ({
                content:  (it.content  as string) ?? "",
                name:     (it.name     as string) ?? "",
                role:     (it.role     as string) ?? undefined,
                location: (it.location as string) ?? undefined,
                rating:   Number(it.rating ?? 5),
              }))
          : [];
        base = {
          ...base,
          testimonialsSection: {
            eyebrow:  (t.eyebrow  as string) ?? base.testimonialsSection.eyebrow,
            title:    (t.title    as string) ?? base.testimonialsSection.title,
            subtitle: (t.subtitle as string) ?? base.testimonialsSection.subtitle,
            items:    items.length ? items : base.testimonialsSection.items,
          },
        };
      }
    } catch (err) { console.error("[Payload] testimonials overlay failed:", err); }

    // FAQ overlay
    try {
      const fg = await pFaq;
      if (fg) {
        const f = fg as Record<string, unknown>;
        const items = Array.isArray(f.items)
          ? (f.items as Array<Record<string, unknown>>)
              .filter((it) => typeof it.question === "string" && (it.question as string).length > 0)
              .map((it) => ({
                question: (it.question as string) ?? "",
                answer:   (it.answer   as string) ?? "",
              }))
          : [];
        base = {
          ...base,
          faq: {
            eyebrow:  (f.eyebrow  as string) ?? base.faq.eyebrow,
            title:    (f.title    as string) ?? base.faq.title,
            subtitle: (f.subtitle as string) ?? base.faq.subtitle,
            items:    items.length ? items : base.faq.items,
          },
        };
      }
    } catch (err) { console.error("[Payload] faq overlay failed:", err); }

    const bi = await pBusiness;
    if (bi && (bi as { name?: string }).name) {
      const b = bi as Record<string, unknown>;
      const social = (b.social ?? {}) as Record<string, unknown>;
      base = {
        ...base,
        business: {
          name:        (b.name as string)        ?? base.business.name,
          tagline:     (b.tagline as string)     ?? base.business.tagline,
          description: (b.description as string) ?? base.business.description,
          phone:       (b.phone as string)       ?? base.business.phone,
          email:       (b.email as string)       ?? base.business.email,
          address:     (b.address as string)     ?? base.business.address,
          hours:       (b.hours as string)       ?? base.business.hours,
          social: {
            facebook:  (social.facebook as string)  ?? base.business.social.facebook,
            instagram: (social.instagram as string) ?? base.business.social.instagram,
            youtube:   (social.youtube as string)   ?? base.business.social.youtube,
          },
        },
      };
    }
  } catch (err) {
    console.error("[Payload] business-info overlay failed, using base:", err);
  }

  return base;
}

/**
 * Public, cached wrapper. Subsequent calls within 30s return the cached
 * result instead of running the 17 Payload queries again. Admin save
 * handlers should call revalidateTag(SITE_CONTENT_TAG) to invalidate.
 */
export const getSiteContent = unstable_cache(
  _getSiteContent,
  ["site-content-v1"],
  { revalidate: 30, tags: [SITE_CONTENT_TAG] }
);

export { SITE_CONTENT_TAG };

/**
 * One-product lookup for the public detail page. Lighter than calling
 * getPublicProducts() (which fetches all 18+) when we only need one.
 */
export async function getPublicProductById(id: string): Promise<Product | null> {
  try {
    const { getPayload } = await import("payload");
    const { default: payloadConfig } = await import("@payload-config");
    const payload = await getPayload({ config: payloadConfig });
    const d = (await payload.findByID({ collection: "products", id, depth: 1 })) as Record<string, unknown> | null;
    if (!d) return null;
    return {
      id:            String(d.id ?? ""),
      brand:         (d.brand as string)         ?? "",
      model:         (d.model as string)         ?? "",
      category:      (d.category as string)      ?? "all",
      originalPrice: Number(d.originalPrice ?? 0),
      salePrice:     Number(d.salePrice ?? 0),
      savings:       Number(d.savings ?? 0),
      grade:         (d.grade as string)         ?? "A",
      warranty:      Number(d.warranty ?? 12),
      icon:          (d.icon as string)          ?? "Package",
      colorFrom:     (d.colorFrom as string)     ?? "#3A5F8A",
      colorTo:       (d.colorTo as string)       ?? "#7FAEDB",
      imageUrl:      (() => {
        const img = d.image as Record<string, unknown> | string | null | undefined;
        if (img && typeof img === "object" && typeof img.url === "string") return img.url;
        return (d.imageUrl as string) ?? "";
      })(),
      description:   (d.description as string)   ?? "",
      specs:         Array.isArray(d.specs)
        ? (d.specs as Array<{ label?: string; value?: string }>).map((s) => ({
            label: s?.label ?? "",
            value: s?.value ?? "",
          }))
        : [],
    };
  } catch (err) {
    console.error("[getPublicProductById] payload read failed:", err);
    return readFromFile().products.find((p) => p.id === id) ?? null;
  }
}

/**
 * Lightweight read for the public Products page — ONE Payload query instead
 * of the 17+ queries getSiteContent runs. Falls back to the JSON seed when
 * Payload is unreachable (e.g. local dev without DATABASE_URI).
 */
export async function getPublicProducts(): Promise<Product[]> {
  try {
    const { getPayload } = await import("payload");
    const { default: payloadConfig } = await import("@payload-config");
    const payload = await getPayload({ config: payloadConfig });
    const res = await payload.find({
      collection: "products",
      limit: 500,
      depth: 1,
      sort: "displayOrder",
    });
    const docs = (res?.docs ?? []) as Array<Record<string, unknown>>;
    const list = docs
      .filter((d) => {
        const model = (d.model as string) ?? "";
        const price = Number(d.salePrice ?? 0);
        return model.trim().length > 0 && price > 0;
      })
      .map((d) => ({
        id:            String(d.id ?? ""),
        brand:         (d.brand as string)         ?? "",
        model:         (d.model as string)         ?? "",
        category:      (d.category as string)      ?? "all",
        originalPrice: Number(d.originalPrice ?? 0),
        salePrice:     Number(d.salePrice ?? 0),
        savings:       Number(d.savings ?? 0),
        grade:         (d.grade as string)         ?? "A",
        warranty:      Number(d.warranty ?? 12),
        icon:          (d.icon as string)          ?? "Package",
        colorFrom:     (d.colorFrom as string)     ?? "#3A5F8A",
        colorTo:       (d.colorTo as string)       ?? "#7FAEDB",
        imageUrl:      (() => {
          const img = d.image as Record<string, unknown> | string | null | undefined;
          if (img && typeof img === "object" && typeof img.url === "string") return img.url;
          return (d.imageUrl as string) ?? "";
        })(),
        description:   (d.description as string)   ?? "",
        specs:         Array.isArray(d.specs)
          ? (d.specs as Array<{ label?: string; value?: string }>).map((s) => ({
              label: s?.label ?? "",
              value: s?.value ?? "",
            }))
          : [],
      })) as Product[];
    if (list.length > 0) return list;
  } catch (err) {
    console.error("[getPublicProducts] payload read failed, falling back to seed:", err);
  }
  return readFromFile().products;
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB }       = await import("@/lib/db");
      const { SiteContentModel } = await import("@/lib/models");
      await connectDB();
      await SiteContentModel.findOneAndUpdate(
        { key: "site" },
        { key: "site", data: content },
        { upsert: true, new: true }
      );
      return;
    } catch (err) {
      console.error("[MongoDB] writeSiteContent failed:", err);
      throw err;
    }
  }
  // Read-only filesystem on Vercel — fail with clear guidance.
  if (process.env.VERCEL) {
    throw new Error(
      "Content edits require persistent storage. Set MONGODB_URI in Vercel project settings " +
      "(see .env.example) — Vercel's filesystem is read-only at runtime, so the JSON file fallback won't work."
    );
  }
  // Local dev fallback (works in `next dev`, fails on Vercel).
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const __tmp = DATA_PATH + ".tmp";
  fs.writeFileSync(__tmp, JSON.stringify(content, null, 2), "utf-8");
  fs.renameSync(__tmp, DATA_PATH);
}
