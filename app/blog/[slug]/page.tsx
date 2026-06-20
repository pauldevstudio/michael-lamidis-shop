import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import LeadCapture from "@/components/sections/LeadCapture";
import { BLOG_POSTS, SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative min-h-[50vh] flex items-end overflow-hidden pt-28 pb-16 noise-overlay"
          style={{ background: `linear-gradient(135deg, ${post.colorFrom}20 0%, #030813 60%)` }}
        >
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full text-white"
                style={{ background: `linear-gradient(135deg, ${post.colorFrom}, ${post.colorTo})` }}
              >
                {post.category}
              </span>
            </div>

            <h1
              className="font-display font-black text-white leading-tight tracking-tighter mb-6"
              style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-5 text-white/45 text-sm">
              <div className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.date}</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime}</div>
            </div>
          </div>
        </section>

        {/* Article */}
        <section className="bg-white section-py">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-navy max-w-none">
              <p className="text-navy-900/70 text-lg leading-relaxed font-medium border-l-4 border-gold-500 pl-5 mb-8">
                {post.excerpt}
              </p>
              <p className="text-navy-900/60 text-base leading-relaxed mb-6">
                Whether you&apos;re furnishing a new home or replacing an aging appliance, open box products from Michael Lamidis offer an exceptional opportunity to own premium brands without paying full retail price. This guide covers everything you need to know to make a confident, informed purchase.
              </p>
              <h2 className="text-navy-950 font-display font-bold text-2xl mb-4 mt-10" style={{ fontFamily: "var(--font-jakarta)" }}>
                What Sets Open Box Apart
              </h2>
              <p className="text-navy-900/60 text-base leading-relaxed mb-6">
                Open box appliances go through a comprehensive certification process before they&apos;re offered for sale. Our 47-point inspection covers every major function, the condition of all components, and aesthetic quality. Each item receives a clear grade — A++, A+, or A — so you know exactly what you&apos;re getting.
              </p>
              <h2 className="text-navy-950 font-display font-bold text-2xl mb-4 mt-10" style={{ fontFamily: "var(--font-jakarta)" }}>
                The Savings Are Real
              </h2>
              <p className="text-navy-900/60 text-base leading-relaxed mb-6">
                Our customers regularly save 30–70% compared to buying the same appliance brand-new. On a premium washing machine retailing at €900, you could pay just €400–600 for an identical unit that&apos;s been professionally inspected and carries a 12-month warranty.
              </p>
              <div className="bg-navy-50 rounded-2xl p-7 my-10 border border-navy-100">
                <h3 className="text-navy-950 font-bold text-lg mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Key Takeaways</h3>
                <ul className="flex flex-col gap-2">
                  {["Open box means certified, tested quality — not damaged goods", "Savings of 30–70% vs. retail without sacrificing reliability", "All items include a 12-month Lamidis warranty", "Expert staff guide you to the right appliance for your needs", "30-day returns if you're not completely satisfied"].map((point) => (
                    <li key={point} className="flex items-start gap-2 text-navy-900/65 text-sm">
                      <Tag className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />{point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <LeadCapture />
      </main>
      <Footer />
    </>
  );
}
