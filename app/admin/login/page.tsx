"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (shake) {
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [shake]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.replace(from);
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid credentials");
        setShake(true);
        setPassword("");
      }
    } catch {
      setError("Connection error — please try again");
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative z-10 w-full max-w-md"
      style={{ animation: shake ? "shake 0.6s ease-in-out" : undefined }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
      <div className="bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.webp"
            alt="Michael Lamidis logo"
            width={64}
            height={64}
            priority
            className="w-16 h-16 mb-4"
          />
          <h1 className="text-white font-display font-bold text-2xl">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Michael Lamidis CMS</p>
        </div>
        <div className="flex items-center justify-center gap-2 mb-8 py-2 px-4 rounded-full border border-white/10 w-fit mx-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-white/50 text-xs font-medium">Secure Access</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-username" className="text-white/60 text-xs font-semibold uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoFocus
                autoComplete="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold-500/60 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="admin-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold-500/60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4 text-red-400 text-sm flex items-center gap-2">
              <span className="text-base">⚠</span>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #3A5F8A 0%, #5B82A8 100%)", color: "#fff", boxShadow: "0 4px 24px rgba(58,95,138,0.35)" }}
          >
            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>) : "Sign In to Admin"}
          </button>
        </form>
      </div>
      <p className="text-center text-white/20 text-xs mt-6">
        © {new Date().getFullYear()} Michael Lamidis · Admin v1.0
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl h-80 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white/40" />
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
