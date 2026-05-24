import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return staticPages;
}
