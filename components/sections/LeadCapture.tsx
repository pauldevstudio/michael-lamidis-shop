"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Shield, Tag, Sparkles, ArrowRight, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

const BENEFIT_ICONS = [Clock, Shield, Tag, Sparkles];

export default function LeadCapture() {
  const { t, lang, pick } = useLanguage();
  const f = t.leadCapture.form;
  const __content = useContent();
  const __lc = __content?.leadCapture;
  const __lcEyebrow  = pick(__lc?.eyebrow,  t.leadCapture.eyebrow);
  const __lcTitle    = pick(__lc?.title,    t.leadCapture.title);
  const __lcSubtitle = pick(__lc?.subtitle, t.leadCapture.subtitle);
  const __lcBenefits = (lang === "en" && __lc?.benefits && __lc.benefits.length > 0) ? __lc.benefits : t.leadCapture.benefits;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", interest: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    analytics.generateLead("lead_capture");
    setTimeout(() => setStatus("sent"), 1500);
  };

  return (
    <section className="section-py relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #030813 0%, #060F2A 50%, #091F52 100%)" }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(200,136,26,0.15) 0%, transparent 60%)" }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(30,72,184,0.2) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Left — copy */}
          <div className="flex flex-col gap-8">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                {__lcEyebrow}
              </span>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <h2
                className="font-display font-black text-white leading-[1.05] tracking-tight"
                style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                {__lcTitle}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <p className="text-white/50 text-base leading-relaxed max-w-md">
                {__lcSubtitle}
              </p>
            </AnimatedSection>

            <div className="flex flex-col gap-3">
              {__lcBenefits.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[i];
                return (
                  <AnimatedSection key={benefit} delay={0.16 + i * 0.07}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-gold-400" />
                      </div>
                      <span className="text-white/70 text-sm font-medium">{benefit}</span>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Social proof */}
            <AnimatedSection delay={0.45}>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {["M", "N", "E", "D"].map((initial, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-navy-800 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `hsl(${i * 60 + 200}, 70%, 40%)` }}
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-white/45 text-xs">
                  <span className="text-white font-semibold">5,000+</span> happy customers
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right — form */}
          <AnimatedSection delay={0.1} direction="left">
            <div className="glass-card rounded-3xl p-7 sm:p-8">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-5 text-center py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                        {f.success}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">{f.successMsg}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">{f.name}</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={set("name")}
                          placeholder={f.name}
                          required
                          className="form-input"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">{f.email}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          placeholder={f.email}
                          required
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">{f.phone}</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set("phone")}
                          placeholder={f.phone}
                          className="form-input"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">{f.interest}</label>
                        <select
                          value={form.interest}
                          onChange={set("interest")}
                          required
                          className="form-input appearance-none"
                        >
                          <option value="" disabled>{f.interest}</option>
                          {f.interestOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-navy-900 text-white">{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">{f.message}</label>
                      <textarea
                        value={form.message}
                        onChange={set("message")}
                        placeholder={f.message}
                        rows={3}
                        className="form-input resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className={cn(
                        "btn-gold w-full justify-center mt-1 text-sm",
                        status === "sending" && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {status === "sending" ? (
                        <>{f.sending}</>
                      ) : (
                        <>{f.submit} <Send className="w-4 h-4" /></>
                      )}
                    </button>

                    <p className="text-white/25 text-[11px] text-center">
                      No spam ever. We respect your privacy.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
