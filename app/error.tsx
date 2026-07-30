"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="text-center max-w-md">
        <p
          className="text-gold-500 text-7xl font-display font-black mb-4"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          500
        </p>
        <h1 className="text-white text-2xl font-bold mb-3">Something Went Wrong</h1>
        <p className="text-white/50 mb-8">
          We&apos;re sorry — an unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary text-sm">
            Try Again
          </button>
          <Link href="/" className="btn-ghost-white text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
