import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="text-center max-w-md">
        <p className="text-gold-500 text-7xl font-display font-black mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>404</p>
        <h1 className="text-white text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary text-sm">Back to Home</Link>
          <Link href="/products" className="btn-ghost-white text-sm">Browse Products</Link>
        </div>
      </div>
    </main>
  );
}
