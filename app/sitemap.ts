import type { MetadataRoute } from "next";
import { SITE_URL, BLOG_POSTS } from "@/lib/constants";
import { getPublicProducts } from "@/lib/site-content";

export const revalidate = 3600; // refresh the generated sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`,     lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/faq`,      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Product detail pages — sourced live so new products are discoverable.
  // Wrapped so a DB hiccup never breaks the sitemap (static pages still serve).
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getPublicProducts();
    productPages = products.map((p) => ({
      url: `${base}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    /* keep static pages only */
  }

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
