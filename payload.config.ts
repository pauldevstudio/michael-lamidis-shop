// Force Node to use Google + Cloudflare DNS for cluster lookups.
// Windows IPv6 resolver (fe80::1) times out on Atlas SRV records; this
// bypasses the OS resolver entirely. Dev-only fix.
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Mount the admin UI at /cms so it doesn't clash with the existing
  // legacy /admin routes during the Phase 1-7 transition. After Phase 8
  // we can either keep /cms or remap to /admin once the old one is gone.
  routes: {
    admin: "/cms",
    api: "/api/payload",
    graphQL: "/api/payload/graphql",
    graphQLPlayground: "/api/payload/graphql-playground",
  },
  admin: {
    user: "users",
    meta: {
      titleSuffix: "- Michael Lamidis CMS",
    },
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email" },
      fields: [
        { name: "name", type: "text" },
      ],
    },
    {
      slug: "media",
      upload: {
        mimeTypes: ["image/*"],
        formatOptions: { format: "webp", options: { quality: 82 } },
        resizeOptions: { width: 1200, withoutEnlargement: true },
        imageSizes: [
          { name: "card", width: 600, height: 400, position: "centre", formatOptions: { format: "webp", options: { quality: 80 } } },
          { name: "full", width: 1200, formatOptions: { format: "webp", options: { quality: 82 } } },
        ],
      },
      // Public site needs to fetch /api/payload/media/file/<name> without
      // an admin session. Anyone can read; only logged-in admins can write.
      access: {
        read:   () => true,
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
        delete: ({ req }) => Boolean(req.user),
      },
      admin: { useAsTitle: "filename" },
      fields: [
        { name: "alt", type: "text" },
      ],
    },
    {
      slug: "products",
      admin: {
        useAsTitle: "model",
        defaultColumns: ["image", "model", "brand", "category", "salePrice", "grade"],
      },
      fields: [
        {
          name: "displayOrder",
          label: "Sort Position",
          type: "number",
          defaultValue: 0,
          admin: {
            position: "sidebar",
            description: "Lower numbers appear first on the website. Change to reorder.",
          },
        },
        {
          type: "row",
          fields: [
            { name: "brand", type: "text", required: true, admin: { width: "50%" } },
            { name: "model", type: "text", required: true, admin: { width: "50%" } },
          ],
        },
        {
          name: "category",
          type: "select",
          required: true,
          options: [
            { label: "Refrigerators",    value: "refrigerators" },
            { label: "Washing Machines", value: "washing-machines" },
            { label: "Ovens",            value: "ovens" },
            { label: "Dishwashers",      value: "dishwashers" },
            { label: "Freezers",         value: "freezers" },
            { label: "Air Conditioners", value: "air-conditioners" },
            { label: "Cookware",         value: "cookware" },
            { label: "Small Appliances", value: "small-appliances" },
            { label: "Mattresses",       value: "mattresses" },
            { label: "Furniture",        value: "furniture" },
            { label: "Garden Furniture", value: "garden-furniture" },
            { label: "Office Equipment", value: "office-equipment" },
            { label: "Tools",            value: "tools" },
            { label: "Kitchenware",      value: "kitchenware" },
            { label: "Bicycles",         value: "bicycles" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "salePrice",     type: "number", required: true, admin: { width: "33%" } },
            { name: "originalPrice", type: "number", required: true, admin: { width: "33%" } },
            { name: "savings",       type: "number", admin: { width: "33%", description: "Auto-calculated if blank" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "grade",    type: "text",   defaultValue: "A",  admin: { width: "50%" } },
            { name: "warranty", type: "number", defaultValue: 12,   admin: { width: "50%", description: "Months" } },
          ],
        },
        { name: "description", type: "textarea" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { description: "Drag & drop an image here. If empty, the Image URL field below is used as a fallback." },
        },
        {
          name: "imageUrl",
          type: "text",
          admin: { description: "Primary image URL (mirrors the first gallery image)." },
        },
        {
          name: "gallery",
          type: "array",
          labels: { singular: "Photo", plural: "Gallery Photos" },
          admin: { description: "All product photos. The first one is the primary image." },
          fields: [
            { name: "url", type: "text", required: true },
          ],
        },
        {
          name: "videoUrl",
          type: "text",
          admin: { description: "Optional product video URL (uploaded via the admin editor; shows a play button on the storefront cards)." },
        },
        {
          name: "sold",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Mark as sold — hides Add to Cart and shows a Sold badge on the storefront." },
        },
        {
          name: "promo",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Feature this item in the homepage Special Offer popup." },
        },
        { name: "icon",        type: "text", defaultValue: "Package" },
        { name: "colorFrom", type: "text", defaultValue: "#3A5F8A", admin: { hidden: true } },
        { name: "colorTo",   type: "text", defaultValue: "#7FAEDB", admin: { hidden: true } },
        {
          name: "specs",
          type: "array",
          labels: { singular: "Spec", plural: "Specs" },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
      ],
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data.savings && data.originalPrice && data.salePrice) {
              data.savings = Math.round(((data.originalPrice - data.salePrice) / data.originalPrice) * 100);
            }
            return data;
          },
        ],
      },
    },
  ],
  globals: [
    // Phase 1: Home page hero. Editable headline / subheadline / CTAs.
    {
      slug: "home-hero",
      label: "Home Hero",
      admin: { group: "Home Page" },
      fields: [
        { name: "locationLabel", type: "text", defaultValue: "Limassol, Cyprus" },
        { name: "badge",         type: "text", defaultValue: "Certified Open Box Quality" },
        {
          name: "headline",
          type: "textarea",
          required: true,
          defaultValue: "Premium Home Appliances\nin Limassol, Cyprus",
          admin: { description: "Use a blank line break in the middle for the gold accent line." },
        },
        {
          name: "subheadline",
          type: "textarea",
          defaultValue: "Refrigerators, Washing Machines, Ovens & More - Designed for Style and Performance",
        },
        {
          type: "row",
          fields: [
            { name: "primaryCtaLabel", type: "text", defaultValue: "Browse Products", admin: { width: "50%" } },
            { name: "primaryCtaHref",  type: "text", defaultValue: "/products",       admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "secondaryCtaLabel", type: "text", defaultValue: "View Collection", admin: { width: "50%" } },
            { name: "secondaryCtaHref",  type: "text", defaultValue: "/products",      admin: { width: "50%" } },
          ],
        },
      ],
    },

    // Phase 1: About page content.
    {
      slug: "about-content",
      label: "About Page",
      admin: { group: "Other Pages" },
      fields: [
        { name: "headline",    type: "text", required: true,
          defaultValue: "How Cyprus Buys Smart" },
        { name: "subheadline", type: "text",
          defaultValue: "The story behind Michael Lamidis Open Box Shop" },
        {
          name: "story",
          type: "array",
          label: "Story paragraphs",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          minRows: 1,
          fields: [
            { name: "text", type: "textarea", required: true },
          ],
        },
      ],
    },

    // Phase 1.1: Contact page content.
    {
      slug: "contact-info",
      label: "Contact Page",
      admin: { group: "Other Pages" },
      fields: [
        { name: "badge",      type: "text", defaultValue: "Contact" },
        { name: "headline",   type: "text", required: true,
          defaultValue: "We're Here to Help You Save" },
        { name: "subheadline", type: "textarea",
          defaultValue: "Visit our Limassol showroom or contact us online. Our specialists respond within 2 hours." },
      ],
    },

    // Phase 1.5: Trust badges (4 cards under hero on home page).
    {
      slug: "trust-badges",
      label: "Trust Badges",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Trusted by Thousands" },
        { name: "title",   type: "text", defaultValue: "Why Families Choose Lamidis" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Badge", plural: "Badges" },
          fields: [
            { name: "icon",        type: "text", defaultValue: "ShieldCheck",
              admin: { description: "lucide-react icon: ShieldCheck, Award, Truck, RefreshCw" } },
            { name: "title",       type: "text", required: true },
            { name: "description", type: "textarea" },
          ],
        },
      ],
    },

    // Phase 1.5: Features section (Why Open Box).
    {
      slug: "features-section",
      label: "Features Section",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow",  type: "text", defaultValue: "Why Open Box?" },
        { name: "title",    type: "text", defaultValue: "The Smart Way to Buy Premium Appliances" },
        { name: "subtitle", type: "textarea",
          defaultValue: "Open box means like-new quality at a fraction of retail." },
        {
          name: "items",
          type: "array",
          labels: { singular: "Feature", plural: "Features" },
          fields: [
            { name: "icon",        type: "text", defaultValue: "Tag",
              admin: { description: "lucide-react icon: Tag, CheckCircle2, Zap, Recycle, Star, HeartHandshake" } },
            { name: "title",       type: "text", required: true },
            { name: "description", type: "textarea" },
          ],
        },
      ],
    },

    // Phase 1.5: Category strip (chips above featured products on home).
    {
      slug: "category-strip",
      label: "Category Strip",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Shop by Category" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Category", plural: "Categories" },
          fields: [
            { name: "id",    type: "text", required: true,
              admin: { description: "Slug: all, refrigerators, washing-machines, ovens, dishwashers, air-conditioners, cookware, small-appliances" } },
            { name: "label", type: "text", required: true },
          ],
        },
      ],
    },

    // Phase 1.5: Navigation menu (top nav links).
    {
      slug: "navigation",
      label: "Navigation Menu",
      admin: { group: "Site-wide" },
      fields: [
        {
          name: "items",
          type: "array",
          labels: { singular: "Link", plural: "Links" },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href",  type: "text", required: true, admin: { description: "e.g. /products" } },
          ],
        },
        { name: "getQuoteLabel", type: "text", defaultValue: "Browse Products" },
        { name: "getQuoteHref",  type: "text", defaultValue: "/products" },
      ],
    },

    // Phase 1.5: Lead capture section (form intro on home page).
    {
      slug: "lead-capture",
      label: "Lead Capture",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow",  type: "text", defaultValue: "Get the Best Deal" },
        { name: "title",    type: "text", defaultValue: "Tell Us What You're Looking For" },
        { name: "subtitle", type: "textarea",
          defaultValue: "Share your needs and we'll find the perfect certified unit at the best possible price - response within 2 hours." },
        {
          name: "benefits",
          type: "array",
          labels: { singular: "Benefit", plural: "Benefits" },
          fields: [{ name: "text", type: "text", required: true }],
        },
      ],
    },

    // Phase 1.5: Footer.
    {
      slug: "footer",
      label: "Footer",
      admin: { group: "Site-wide" },
      fields: [
        { name: "description", type: "textarea",
          defaultValue: "Cyprus's premier destination for certified open box appliances. Quality you can trust, savings you'll love." },
        { name: "copyright",   type: "text",
          defaultValue: "Michael Lamidis. All rights reserved." },
        {
          name: "companyLinks",
          type: "array",
          labels: { singular: "Company Link", plural: "Company Links" },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href",  type: "text", required: true },
          ],
        },
        {
          name: "servicesLinks",
          type: "array",
          labels: { singular: "Service Link", plural: "Service Links" },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href",  type: "text", required: true },
          ],
        },
      ],
    },

    // Phase 1.5: Contact page section labels.
    {
      slug: "contact-section",
      label: "Contact Section",
      admin: { group: "Other Pages" },
      fields: [
        { name: "eyebrow",       type: "text", defaultValue: "Get in Touch" },
        { name: "title",         type: "text", defaultValue: "We're Here to Help" },
        { name: "subtitle",      type: "textarea",
          defaultValue: "Visit our Limassol showroom or reach out online. Our appliance specialists are ready." },
        { name: "addressLabel",  type: "text", defaultValue: "Address" },
        { name: "phoneLabel",    type: "text", defaultValue: "Phone" },
        { name: "emailLabel",    type: "text", defaultValue: "Email" },
        { name: "hoursLabel",    type: "text", defaultValue: "Hours" },
        { name: "mapCta",        type: "text", defaultValue: "Get Directions" },
      ],
    },

    // Phase 1.5: Top announcement bar (above the navbar).
    {
      slug: "announcement-bar",
      label: "Announcement Bar",
      admin: { group: "Site-wide" },
      fields: [
        { name: "enabled",  type: "checkbox", defaultValue: true, admin: { description: "Show or hide the bar entirely." } },
        { name: "message",  type: "text", required: true,
          defaultValue: "Summer Sale - Up to 70% off premium open box appliances. Limited stock!" },
        { name: "ctaLabel", type: "text", defaultValue: "Shop Now" },
        { name: "ctaHref",  type: "text", defaultValue: "/products" },
      ],
    },

    // Phase 1.3: Statistics counters on home page.
    {
      slug: "stats",
      label: "Stats Section",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Our Impact" },
        { name: "title",   type: "text", defaultValue: "Numbers That Tell the Story" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Stat", plural: "Stats" },
          fields: [
            { name: "value",  type: "number", required: true, defaultValue: 0,
              admin: { description: "Number to count up to" } },
            { name: "suffix", type: "text", defaultValue: "+",
              admin: { description: "e.g. + or %" } },
            { name: "label",  type: "text", required: true },
          ],
        },
      ],
    },

    // Phase 1.3: Services section.
    {
      slug: "services-section",
      label: "Services Section",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow",  type: "text", defaultValue: "What We Do" },
        { name: "title",    type: "text", defaultValue: "Premium Services" },
        { name: "subtitle", type: "textarea",
          defaultValue: "From sourcing to installation - we handle everything so you get a worry-free open box experience." },
        {
          name: "items",
          type: "array",
          labels: { singular: "Service", plural: "Services" },
          fields: [
            { name: "icon",  type: "text", defaultValue: "Search",
              admin: { description: "lucide-react icon name. Available: Search, Wrench, Settings, Package" } },
            { name: "title",       type: "text", required: true },
            { name: "description", type: "textarea" },
            { name: "price",       type: "text", admin: { description: "e.g. \"FREE\" or \"\u20ac49\"" } },
            { name: "badge",       type: "text", admin: { description: "Optional badge text" } },
          ],
        },
      ],
    },

    // Phase 1.3: Testimonials section.
    {
      slug: "testimonials-section",
      label: "Testimonials Section",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow",  type: "text", defaultValue: "Customer Stories" },
        { name: "title",    type: "text", defaultValue: "Thousands of Happy Families" },
        { name: "subtitle", type: "textarea",
          defaultValue: "Real reviews from real customers who saved big without compromising quality." },
        {
          name: "items",
          type: "array",
          labels: { singular: "Testimonial", plural: "Testimonials" },
          fields: [
            { name: "content",  type: "textarea", required: true, admin: { description: "The quote" } },
            { name: "name",     type: "text",     required: true, admin: { description: "Customer name" } },
            { name: "role",     type: "text",     admin: { description: "Homeowner / Business / etc." } },
            { name: "location", type: "text",     admin: { description: "Limassol, Nicosia, etc." } },
            { name: "rating",   type: "number",   min: 1, max: 5, defaultValue: 5 },
          ],
        },
      ],
    },

    // Phase 1.3: FAQ section.
    {
      slug: "faq-section",
      label: "FAQ Section",
      admin: { group: "Home Page" },
      fields: [
        { name: "eyebrow",  type: "text", defaultValue: "Questions" },
        { name: "title",    type: "text", defaultValue: "Frequently Asked Questions" },
        { name: "subtitle", type: "textarea",
          defaultValue: "Everything you need to know before you buy." },
        {
          name: "items",
          type: "array",
          labels: { singular: "FAQ", plural: "FAQs" },
          fields: [
            { name: "question", type: "text", required: true },
            { name: "answer",   type: "textarea", required: true },
          ],
        },
      ],
    },

    // Phase 1 starter: Business Identity.
    // Everything Michael edits day-to-day lives here.
    {
      slug: "business-info",
      label: "Business Info",
      admin: { group: "Site-wide" },
      fields: [
        { name: "name",        type: "text",     required: true, defaultValue: "Michael Lamidis" },
        { name: "tagline",     type: "text",     defaultValue: "Open Box. Open Savings." },
        { name: "description", type: "textarea" },
        {
          type: "row",
          fields: [
            { name: "phone", type: "text", admin: { width: "50%" } },
            { name: "email", type: "email", admin: { width: "50%" } },
          ],
        },
        { name: "address", type: "text" },
        { name: "hours",   type: "text", defaultValue: "Mon-Sat: 09:00-20:00" },
        {
          name: "social",
          type: "group",
          fields: [
            { name: "facebook",  type: "text" },
            { name: "instagram", type: "text" },
            { name: "youtube",   type: "text" },
          ],
        },
      ],
    },
  ],
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      collections: {
        media: true,
      },
    }),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
});
