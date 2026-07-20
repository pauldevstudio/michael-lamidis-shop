import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";

/**
 * Shared shell for legal / policy pages (Privacy, Cookies, Terms…).
 * Keeps the site's navbar, footer, fonts and navy/gold palette so the pages
 * match the rest of the site instead of looking bolted-on.
 */
export default function LegalPage({
  title,
  intro,
  lastUpdated,
  children,
}: {
  title: string;
  intro?: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative bg-navy-900 overflow-hidden pt-32 pb-14">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 70% 90%, rgba(59,130,246,0.06) 0%, transparent 55%)" }} />
          <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/75 text-[11px] font-medium tracking-[0.12em] uppercase">Legal</span>
            <h1 className="font-display font-black text-white leading-[1.06] tracking-[-0.025em] mt-7"
              style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>
              {title}
            </h1>
            {intro && <p className="text-white/55 text-[0.95rem] sm:text-[1.05rem] leading-[1.7] max-w-[480px] mt-5">{intro}</p>}
            <p className="text-white/40 text-[11px] tracking-wide mt-5">Last updated: {lastUpdated}</p>
          </div>
        </section>

        {/* Body */}
        <article
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-14
            [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-navy-950 [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:font-semibold [&_h3]:text-navy-900 [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:text-navy-600 [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-[15px]
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1.5
            [&_li]:text-navy-600 [&_li]:text-[15px] [&_li]:leading-relaxed
            [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-900
            [&_strong]:text-navy-900 [&_strong]:font-semibold
            [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:my-5
            [&_th]:text-left [&_th]:font-semibold [&_th]:text-navy-900 [&_th]:border-b [&_th]:border-navy-200 [&_th]:py-2 [&_th]:pr-4 [&_th]:align-top
            [&_td]:text-navy-600 [&_td]:border-b [&_td]:border-navy-100 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top"
        >
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
