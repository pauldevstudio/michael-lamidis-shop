import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin sign-in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-hero px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-7 shadow-elevated">
          <h1 className="font-heading text-2xl font-bold text-ink-900">Admin sign-in</h1>
          <p className="mt-1 text-sm text-ink-500">Manage products, content, and leads.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-ink-500">
          <Link href="/" className="hover:text-ink-900 link-underline">← Back to site</Link>
        </p>
      </div>
    </main>
  );
}
