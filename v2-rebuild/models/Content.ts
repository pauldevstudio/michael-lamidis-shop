/**
 * Content is a singleton document (key="site") storing editable site copy.
 * Mongoose schema is intentionally loose (Mixed for nested arrays) so admins
 * can extend without re-migrating; runtime validation lives in lib/validation.ts.
 */
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "site", index: true },
    business: {
      name: String, tagline: String, description: String,
      phone: String, email: String, address: String, hours: String,
    },
    hero: {
      badge: String, headline: String, subheadline: String,
      ctaPrimary: String, ctaSecondary: String,
    },
    about: { headline: String, body: String },
    cta: { headline: String, subheadline: String, ctaPrimary: String, ctaSecondary: String },
    stats: [{ label: String, value: String, _id: false }],
    brands: [{ name: String, logoUrl: String, _id: false }],
    features: [{ icon: String, title: String, body: String, _id: false }],
    categories: [{ name: String, image: String, href: String, tagline: String, _id: false }],
    process: [{ title: String, body: String, _id: false }],
    testimonials: [{ quote: String, name: String, role: String, city: String, _id: false }],
    pricing: [{
      name: String, tagline: String, savings: String,
      highlights: [String], featured: Boolean, _id: false,
    }],
    faqs: [{ question: String, answer: String, _id: false }],
  },
  { timestamps: true, minimize: false }
);

export type ContentDoc = InferSchemaType<typeof ContentSchema> & { _id: string };

export const ContentModel: Model<ContentDoc> =
  (models.Content as Model<ContentDoc>) ||
  model<ContentDoc>("Content", ContentSchema);
