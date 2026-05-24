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
export interface HeroContent    { badge: string; headline: string; subheadline: string }
export interface AboutContent   { headline: string; subheadline: string; story: string[] }
export interface StatsContent   { customers: string; brands: string; savings: string; cities: string }
export interface ThemeContent   { primaryColor: string; accentColor: string; fontHeading: string; fontBody: string }
export interface SeoPage        { title: string; description: string }
export interface SiteContent {
  business: BusinessInfo; hero: HeroContent; about: AboutContent;
  stats: StatsContent; theme: ThemeContent;
  seo: Record<string, SeoPage>; products: Product[];
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
    theme:    { ...DEFAULT_CONTENT.theme,    ...parsed.theme },
    seo:      { ...DEFAULT_CONTENT.seo,      ...parsed.seo },
    products: parsed.products?.length ? parsed.products : DEFAULT_CONTENT.products,
  };
}

function readFromFile(): SiteContent {
  try {
    return mergeDefaults(JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as Partial<SiteContent>);
  } catch { return DEFAULT_CONTENT; }
}

// ─── Public API ───────────────────────────────────────────────────

export async function getSiteContent(): Promise<SiteContent> {
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB }       = await import("@/lib/db");
      const { SiteContentModel } = await import("@/lib/models");
      await connectDB();
      const doc = await SiteContentModel.findOne({ key: "site" }).lean();
      if (doc?.data) return mergeDefaults(doc.data as Partial<SiteContent>);
      // First run — seed from JSON file
      const seed = readFromFile();
      await SiteContentModel.create({ key: "site", data: seed });
      return seed;
    } catch (err) {
      console.error("[MongoDB] getSiteContent failed, falling back to file:", err);
    }
  }
  return readFromFile();
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
  fs.writeFileSync(DATA_PATH, JSON.stringify(content, null, 2), "utf-8");
}
