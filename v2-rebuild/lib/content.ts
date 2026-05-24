import "server-only";
import { connectDB } from "@/lib/db";
import { ContentModel } from "@/models/Content";
import { DEFAULT_CONTENT } from "@/lib/default-content";
import type { SiteContent } from "@/types";

export async function getSiteContent(): Promise<SiteContent> {
  try {
    await connectDB();
    const doc = await ContentModel.findOne({ key: "site" }).lean();
    if (!doc) return DEFAULT_CONTENT;

    // Shallow-merge stored fields over defaults so newly added sections
    // (added in code before they're saved in the DB) still render correctly.
    return {
      ...DEFAULT_CONTENT,
      ...(doc as unknown as Partial<SiteContent>),
      business: { ...DEFAULT_CONTENT.business, ...(doc.business ?? {}) },
      hero: { ...DEFAULT_CONTENT.hero, ...(doc.hero ?? {}) },
      about: { ...DEFAULT_CONTENT.about, ...(doc.about ?? {}) },
      cta: { ...DEFAULT_CONTENT.cta, ...(doc.cta ?? {}) },
      stats: doc.stats?.length ? doc.stats : DEFAULT_CONTENT.stats,
      brands: doc.brands?.length ? doc.brands : DEFAULT_CONTENT.brands,
      features: doc.features?.length ? doc.features : DEFAULT_CONTENT.features,
      categories: doc.categories?.length ? doc.categories : DEFAULT_CONTENT.categories,
      process: doc.process?.length ? doc.process : DEFAULT_CONTENT.process,
      testimonials: doc.testimonials?.length ? doc.testimonials : DEFAULT_CONTENT.testimonials,
      pricing: doc.pricing?.length ? doc.pricing : DEFAULT_CONTENT.pricing,
      faqs: doc.faqs?.length ? doc.faqs : DEFAULT_CONTENT.faqs,
      updatedAt:
        (doc as { updatedAt?: Date }).updatedAt?.toISOString() ?? DEFAULT_CONTENT.updatedAt,
    } as SiteContent;
  } catch {
    return DEFAULT_CONTENT;
  }
}
