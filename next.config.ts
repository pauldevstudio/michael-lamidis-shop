import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Compression ─────────────────────────────────────
  compress: true,

  // ─── Image optimisation ───────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.michaellamidis.com.cy" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // ─── Experimental ─────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
    ],
  },

  // ─── HTTP headers ─────────────────────────────────────
  // (security headers are also in vercel.json — this adds
  //  cache-control for static assets in local `next start`)
  async headers() {
    // Only apply aggressive caching in production. In dev, the browser
    // would otherwise cache /_next/static/*.js for a year and never pick
    // up edits without a manual hard refresh.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/:path*.(jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ─── Redirects ────────────────────────────────────────
  async redirects() {
    return [
      // Legacy URL patterns → canonical
      { source: "/shop",        destination: "/products", permanent: true },
      { source: "/store",       destination: "/products", permanent: true },
      { source: "/products/all",destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
