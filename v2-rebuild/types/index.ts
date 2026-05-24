export type ID = string;

/* ----------------------------- Products ----------------------------- */

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductCondition = "new" | "open-box" | "refurbished";

export interface Product {
  _id: ID;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  condition: ProductCondition;
  images: ProductImage[];
  specs: ProductSpec[];
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<Product, "_id" | "createdAt" | "updatedAt">;

/* ------------------------------ Content ----------------------------- */

export interface Feature { icon: string; title: string; body: string; }
export interface Category { name: string; image: string; href?: string; tagline?: string; }
export interface ProcessStep { title: string; body: string; }
export interface Testimonial { quote: string; name: string; role?: string; city?: string; }
export interface FaqItem { question: string; answer: string; }
export interface PricingTier {
  name: string;
  tagline: string;
  savings: string;
  highlights: string[];
  featured?: boolean;
}
export interface Brand { name: string; logoUrl?: string; }

export interface SiteContent {
  business: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    headline: string;
    body: string;
  };
  stats: { label: string; value: string }[];
  brands: Brand[];
  features: Feature[];
  categories: Category[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  pricing: PricingTier[];
  faqs: FaqItem[];
  cta: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  updatedAt: string;
}

/* ------------------------------ Leads ------------------------------- */

export interface Lead {
  _id: ID;
  name: string;
  email: string;
  phone?: string;
  message: string;
  productSlug?: string;
  createdAt: string;
}

export type LeadInput = Omit<Lead, "_id" | "createdAt">;

export interface AdminUser {
  _id: ID;
  email: string;
  name: string;
  role: "admin";
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
