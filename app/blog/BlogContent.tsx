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
      <section className="relative min-h-[42vh] flex items-end bg-navy-900 overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 90%, rgba(59,130,246,0.06) 0%, transparent 55%)" }}
        />
        <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/75 text-[11px] font-medium tracking-[0.12em] uppercase mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" /> Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-[1.06] tracking-[-0.025em] max-w-3xl"
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
          >
            Appliance Tips &{" "}
            <span className="text-blue-400">Smart Savings</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="text-white/55 text-[0.95rem] sm:text-[1.05rem] leading-[1.7] max-w-[480px] mt-5"
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
