import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  compress: true,

  images: {
    // Serve images directly (no Vercel Image Optimization).
    //
    // WHY: the project runs on the Vercel Hobby plan, which meters /_next/image
    // transformations. With 100+ products × multiple sizes × avif/webp, the
    // monthly allotment is exhausted, after which Vercel returns HTTP 402
    // (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) for EVERY <Image> request — so
    // every product photo renders broken on the live site even though the
    // underlying Blob URLs are healthy (200). Bypassing the optimizer makes
    // <Image> emit the raw source URL, which loads straight from Vercel Blob
    // (and Unsplash/Pexels). Product photos are already cropped/compressed webp
    // (~55 KB) at upload, so quality/size stay good without the optimizer.
    //
    // To RE-ENABLE optimization later: upgrade the Vercel project to Pro (or
    // add an external loader) and delete this `unoptimized` line. remotePatterns
    // below stay as the allowlist for that day.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.michaellamidis.com.cy" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  serverExternalPackages: ["payload", "mongoose"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
    ],
    // Payload writes some files Next normally treats as untracked deps.
    
  },

  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/:path*.(jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|mp4)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Canonical host: send the free *.vercel.app URL to the custom domain so the
      // site is publicly served only from www.michaellamidisshop.com. The Vercel URL
      // still resolves but 308-forwards, so there is one canonical site for SEO.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?:.+\\.)?vercel\\.app" }],
        destination: "https://www.michaellamidisshop.com/:path*",
        permanent: true,
      },
      { source: "/shop",        destination: "/products", permanent: true },
      { source: "/store",       destination: "/products", permanent: true },
      { source: "/products/all",destination: "/products", permanent: true },
      { source: "/privacy",     destination: "/privacy-policy", permanent: true },
      { source: "/cookies",     destination: "/cookie-policy", permanent: true },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
