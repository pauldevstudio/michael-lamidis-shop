/**
 * Server-side product queries — kept thin so route handlers and RSC pages
 * share one implementation.
 */
import "server-only";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import type { Product } from "@/types";

function serialize(doc: Record<string, unknown>): Product {
  return {
    _id: String(doc._id),
    slug: doc.slug as string,
    name: doc.name as string,
    brand: doc.brand as string,
    category: doc.category as string,
    description: doc.description as string,
    price: doc.price as number,
    originalPrice: doc.originalPrice as number | undefined,
    currency: (doc.currency as string) ?? "EUR",
    condition: doc.condition as Product["condition"],
    images: (doc.images as Product["images"]) ?? [],
    specs: (doc.specs as Product["specs"]) ?? [],
    stock: (doc.stock as number) ?? 0,
    featured: Boolean(doc.featured),
    active: Boolean(doc.active),
    createdAt: (doc.createdAt as Date)?.toISOString?.() ?? "",
    updatedAt: (doc.updatedAt as Date)?.toISOString?.() ?? "",
  };
}

interface ListOptions {
  category?: string;
  brand?: string;
  featured?: boolean;
  activeOnly?: boolean;
  limit?: number;
}

export async function listProducts(opts: ListOptions = {}): Promise<Product[]> {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (opts.category) filter.category = opts.category;
  if (opts.brand) filter.brand = opts.brand;
  if (opts.featured) filter.featured = true;
  if (opts.activeOnly ?? true) filter.active = true;

  const docs = await ProductModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(opts.limit ?? 100)
    .lean();
  return docs.map(serialize);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connectDB();
  const doc = await ProductModel.findOne({ slug, active: true }).lean();
  return doc ? serialize(doc) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await connectDB();
  const doc = await ProductModel.findById(id).lean();
  return doc ? serialize(doc) : null;
}
