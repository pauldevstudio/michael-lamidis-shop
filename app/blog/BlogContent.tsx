"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import LeadCapture from "@/components/sections/LeadCapture";

export default function BlogContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end bg-navy-950 noise-overlay overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(30,72,184,0.2) 0%, transparent 60%)" }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-tight tracking-tighter max-w-3xl"
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
          >
            Appliance Tips &{" "}
            <span className="text-gradient-gold">Smart Savings</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-white/50 text-lg mt-4 max-w-lg"
          >
            Expert guides and money-saving strategies from the Lamidis team.
          </motion.p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map(({ slug, title, excerpt, category, date, readTime, author, colorFrom, colorTo, imageUrl }) => (
              <StaggerItem key={slug}>
                <Link
                  href={`/blog/${slug}`}
                  className="group flex flex-col rounded-2xl border border-navy-100/60 bg-white overflow-hidden hover:border-navy-200 hover:shadow-card-lift transition-all duration-400 h-full"
                >
                  {/* Card thumbnail — real photo */}
                  <div className="h-48 relative overflow-hidden">
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      </>
                    ) : (
                      <div
                        className="h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${colorFrom}20 0%, ${colorTo}10 100%)` }}
                      />
                    )}

                    {/* Category pill */}
                    <div
                      className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-md"
                      style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
                    >
                      {category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 p-6 flex-1">
                    <h2 className="text-navy-950 font-semibold text-base leading-snug group-hover:text-blue-600 transition-colors" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {title}
                    </h2>
                    <p className="text-navy-900/50 text-sm leading-relaxed flex-1">{excerpt}</p>

                    <div className="flex items-center gap-4 pt-3 border-t border-navy-100/60">
                      <div className="flex items-center gap-1.5 text-navy-400 text-xs">
                        <User className="w-3 h-3" />
                        {author}
                      </div>
                      <div className="flex items-center gap-1.5 text-navy-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {readTime}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-navy-300 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <LeadCapture />
    </>
  );
}
