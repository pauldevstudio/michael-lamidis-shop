import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-hero px-4">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">404</p>
        <h1 className="mt-3 font-heading text-5xl font-bold tracking-tight text-ink-900">
          Page not found
        </h1>
        <p className="mt-3 text-base text-ink-500 max-w-prose mx-auto">
          The page you're looking for doesn't exist. Try the catalog instead.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link href="/"><Button>Back to home</Button></Link>
          <Link href="/products"><Button variant="secondary">Browse catalog</Button></Link>
        </div>
      </div>
    </main>
  );
}
