import { z } from "zod";

/* ------------------------------ Product ----------------------------- */

export const productSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(160),
  brand: z.string().min(1).max(80),
  category: z.string().min(1).max(80),
  description: z.string().min(1).max(4000),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional(),
  currency: z.string().length(3).default("EUR"),
  condition: z.enum(["new", "open-box", "refurbished"]),
  images: z
    .array(z.object({ url: z.string().url(), alt: z.string().optional() }))
    .default([]),
  specs: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
  stock: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

/* -------------------------- Leads / Auth ---------------------------- */

export const leadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().min(1).max(2000),
  productSlug: z.string().max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/* ----------------------------- Content ------------------------------ */

const businessSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  hours: z.string(),
});

const heroSchema = z.object({
  badge: z.string(),
  headline: z.string(),
  subheadline: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});

const aboutSchema = z.object({
  headline: z.string(),
  body: z.string(),
});

const ctaSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});

export const contentSchema = z.object({
  business: businessSchema,
  hero: heroSchema,
  about: aboutSchema,
  cta: ctaSchema,
  stats: z.array(z.object({ label: z.string(), value: z.string() })),
  brands: z.array(z.object({ name: z.string(), logoUrl: z.string().optional() })),
  features: z.array(
    z.object({ icon: z.string(), title: z.string(), body: z.string() })
  ),
  categories: z.array(
    z.object({
      name: z.string(),
      image: z.string(),
      href: z.string().optional(),
      tagline: z.string().optional(),
    })
  ),
  process: z.array(z.object({ title: z.string(), body: z.string() })),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      name: z.string(),
      role: z.string().optional(),
      city: z.string().optional(),
    })
  ),
  pricing: z.array(
    z.object({
      name: z.string(),
      tagline: z.string(),
      savings: z.string(),
      highlights: z.array(z.string()),
      featured: z.boolean().optional(),
    })
  ),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export type ProductPayload = z.infer<typeof productSchema>;
export type LeadPayload = z.infer<typeof leadSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type ContentPayload = z.infer<typeof contentSchema>;
