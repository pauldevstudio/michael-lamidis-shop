import fs from "fs";
import path from "path";
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
  imageUrl?: string;
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
    imageUrl: "",
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
  // Stored CMS content (file or DB) may still carry keys removed from the
  // schema — e.g. the legacy trustBadges block. Strip them before spreading
  // so stale data isn't merged into or served from the response.
  const src = { ...parsed } as Partial<SiteContent>;
  delete (src as Record<string, unknown>).trustBadges;
  return {
    ...DEFAULT_CONTENT, ...src,
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
 * Read SiteContent from MongoDB (the source of truth that the custom
 * admin UI at /admin/content / /admin/business / /admin/seo writes to).
 * Previously this function also overlaid Payload globals on top, but
 * those globals were seeded once and never edited via the admin UI —
 * they kept overriding the user's actual edits. Drop the overlay so
 * the admin's saves show on the public site.
 */
async function _getSiteContent(): Promise<SiteContent> {
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB } = await import("@/lib/db");
      const { SiteContentModel } = await import("@/lib/models");
      await connectDB();
      const doc = await SiteContentModel
        .findOne({ key: "site" })
        .lean<{ key: string; data: Partial<SiteContent> } | null>();
      if (doc?.data) return mergeDefaults(doc.data);
    } catch (err) {
      console.error("[MongoDB] getSiteContent failed, falling back to file:", err);
    }
  }
  return readFromFile();
}

/**
 * Public wrapper. Was previously unstable_cache'd with revalidateTag-based
 * invalidation, but revalidateTag wasn't actually busting the entry in this
 * setup — admin saves looked successful but reads kept returning stale data.
 * Uncached for now; correctness over the ~500ms saved per call. Pages that
 * need the result still get their own ISR cache via revalidate at page level,
 * and admin save handlers flush those via revalidatePath.
 */
export const getSiteContent = _getSiteContent;

export { SITE_CONTENT_TAG };

/** Extract gallery image URLs from a Payload product doc. */
function galleryFromDoc(d: Record<string, unknown>): string[] {
  return Array.isArray(d.gallery)
    ? (d.gallery as Array<{ url?: string }>).map((g) => g?.url ?? "").filter(Boolean)
    : [];
}

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
        const gallery = galleryFromDoc(d);
        if (gallery.length > 0) return gallery[0];
        const img = d.image as Record<string, unknown> | string | null | undefined;
        if (img && typeof img === "object" && typeof img.url === "string") return img.url;
        return (d.imageUrl as string) ?? "";
      })(),
      images:        (() => {
        const gallery = galleryFromDoc(d);
        if (gallery.length > 0) return gallery;
        const img = d.image as Record<string, unknown> | string | null | undefined;
        const fallback = (img && typeof img === "object" && typeof img.url === "string")
          ? img.url
          : ((d.imageUrl as string) ?? "");
        return fallback ? [fallback] : [];
      })(),
      sold:          Boolean(d.sold),
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
          const gallery = galleryFromDoc(d);
          if (gallery.length > 0) return gallery[0];
          const img = d.image as Record<string, unknown> | string | null | undefined;
          if (img && typeof img === "object" && typeof img.url === "string") return img.url;
          return (d.imageUrl as string) ?? "";
        })(),
        images:        galleryFromDoc(d),
        sold:          Boolean(d.sold),
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
