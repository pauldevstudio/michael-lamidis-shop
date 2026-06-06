"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import SectionHeader from "@/components/shared/SectionHeader";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { SITE_ADDRESS, SITE_EMAIL, SITE_HOURS, SITE_PHONE, SITE_WHATSAPP } from "@/lib/constants";

export default function ContactSection() {
  const { t, pick } = useLanguage();
  const f = t.contact.form;
  const __content = useContent();
  const __cs = __content?.contactSection;
  const __csEyebrow      = pick(__cs?.eyebrow,      t.contact.eyebrow);
  const __csTitle        = pick(__cs?.title,        t.contact.title);
  const __csSubtitle     = pick(__cs?.subtitle,     t.contact.subtitle);
  const __csAddressLabel = pick(__cs?.addressLabel, t.contact.addressLabel);
  const __csPhoneLabel   = pick(__cs?.phoneLabel,   t.contact.phoneLabel);
  const __csEmailLabel   = pick(__cs?.emailLabel,   t.contact.emailLabel);
  const __csHoursLabel   = pick(__cs?.hoursLabel,   t.contact.hoursLabel);
  const __csMapCta       = pick(__cs?.mapCta,       t.contact.mapCta);
  const __bi = __content?.business;
  const __biAddress = __bi?.address || SITE_ADDRESS;
  const __biPhone   = __bi?.phone   || SITE_PHONE;
  const __biEmail   = __bi?.email   || SITE_EMAIL;
  const __biHours   = __bi?.hours   || SITE_HOURS;

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
  };

  const contactItems = [
    { icon: MapPin, label: __csAddressLabel, value: __biAddress, href: null },
    { icon: Phone, label: __csPhoneLabel, value: __biPhone, href: `tel:${__biPhone.replace(/\s/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: SITE_WHATSAPP, href: `https://wa.me/${SITE_WHATSAPP.replace(/\D/g, "")}` },
    { icon: Mail, label: __csEmailLabel, value: __biEmail, href: `mailto:${__biEmail}` },
    { icon: Clock, label: __csHoursLabel, value: __biHours, href: null },
  ];

  return (
    <section className="bg-white section-py" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader
          eyebrow={__csEyebrow}
          title={__csTitle}
          subtitle={__csSubtitle}
          theme="light"
          className="mb-14"
        />

        <div className="grid lg:grid-cols-5 gap-10 xl:gap-14">
          {/* Left — contact info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Map placeholder */}
            <AnimatedSection>
              <div
                className="w-full h-44 rounded-2xl overflow-hidden relative border border-navy-100"
                style={{ background: "linear-gradient(135deg, #EEF0FA 0%, #E4E8F5 100%)" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-navy-950 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gold-400" />
                  </div>
                  <p className="text-navy-400 text-sm font-medium">{t.pages.contact.showroomLabel}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(__biAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-dark text-xs !px-4 !py-2"
                  >
                    {__csMapCta} <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <div className="flex flex-col gap-4">
              {contactItems.map(({ icon: Icon, label, value, href }, i) => (
                <AnimatedSection key={label} delay={i * 0.07}>
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-navy-100/60 bg-navy-50/40 hover:border-navy-200 hover:bg-white transition-all duration-300">
                    <div className="w-9 h-9 rounded-lg bg-navy-950 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-navy-400 text-[11px] font-bold uppercase tracking-widest">{label}</span>
                      {href ? (
                        <a href={href} className="text-navy-900 text-sm font-medium hover:text-blue-600 transition-colors leading-snug">
                          {value}
                        </a>
                      ) : (
                        <span className="text-navy-900 text-sm font-medium leading-snug">{value}</span>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <AnimatedSection className="lg:col-span-3" direction="left" delay={0.1}>
            <div className="bg-white rounded-2xl border border-navy-100/70 p-7 sm:p-8 shadow-card-lift">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-5 text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-navy-950 font-bold text-xl mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                        {f.success}
                      </h3>
                      <p className="text-navy-900/50 text-sm leading-relaxed">{f.successMsg}</p>
                    </div>
                    <button
                      onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="btn-ghost-dark text-sm"
                    >
                      {t.pages.contact.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-navy-400 text-xs font-bold uppercase tracking-widest">{f.name}</label>
                        <input type="text" value={form.name} onChange={set("name")} placeholder={f.name} required className="form-input-light" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-navy-400 text-xs font-bold uppercase tracking-widest">{f.email}</label>
                        <input type="email" value={form.email} onChange={set("email")} placeholder={f.email} required className="form-input-light" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-navy-400 text-xs font-bold uppercase tracking-widest">{f.subject}</label>
                      <input type="text" value={form.subject} onChange={set("subject")} placeholder={f.subject} className="form-input-light" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-navy-400 text-xs font-bold uppercase tracking-widest">{f.message}</label>
                      <textarea value={form.message} onChange={set("message")} placeholder={f.message} rows={5} required className="form-input-light resize-none" />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-primary w-full justify-center text-sm mt-1"
                    >
                      {status === "sending" ? t.pages.contact.sending : f.submit}
                      <Send className="w-4 h-4" />
                    </button>
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
