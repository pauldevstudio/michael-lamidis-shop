"use client";

import Link from "next/link";
import {
  Package,
  Building2,
  FileText,
  Image,
  Palette,
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  Star,
  MapPin,
  ExternalLink,
  Activity,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { SiteContent } from "@/lib/site-content";

interface Props {
  content: SiteContent;
}

export default function AdminDashboard({ content }: Props) {
  const stats = [
    {
      label: "Products",
      value: content.products.length.toString(),
      sub: "in catalog",
      icon: Package,
      color: "#3A5F8A",
      bg: "#EFF6FF",
    },
    {
      label: "Customers",
      value: content.stats.customers,
      sub: "served",
      icon: Users,
      color: "#059669",
      bg: "#F0FDF4",
    },
    {
      label: "Avg. Savings",
      value: content.stats.savings,
      sub: "off retail",
      icon: TrendingUp,
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      label: "Location",
      value: content.stats.cities,
      sub: "coverage",
      icon: MapPin,
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
  ];

  const quickActions = [
    {
      href: "/admin/business",
      label: "Edit Business Info",
      desc: "Name, phone, address, social links",
      icon: Building2,
      color: "#3A5F8A",
    },
    {
      href: "/admin/products",
      label: "Manage Products",
      desc: "Add, edit or remove products",
      icon: Package,
      color: "#059669",
    },
    {
      href: "/admin/content",
      label: "Edit Content",
      desc: "Hero, About, and page text",
      icon: FileText,
      color: "#D97706",
    },
    {
      href: "/admin/media",
      label: "Upload Media",
      desc: "Manage images and assets",
      icon: Image,
      color: "#7C3AED",
    },
    {
      href: "/admin/theme",
      label: "Customize Theme",
      desc: "Colors, fonts, and brand",
      icon: Palette,
      color: "#DB2777",
    },
    {
      href: "/admin/seo",
      label: "SEO Settings",
      desc: "Meta titles and descriptions",
      icon: Search,
      color: "#0891B2",
    },
  ];

  const recentProducts = content.products.slice(0, 5);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle={`Welcome back! Managing ${content.business.name}`}
        actions={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 text-white text-sm font-medium hover:bg-navy-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Site
          </a>
        }
      />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-slate-900 rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <Activity className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-display font-black text-slate-100">{value}</p>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                {label} <span className="text-slate-400">{sub}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-slate-200 text-xs font-bold uppercase tracking-widest mb-3">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map(({ href, label, desc, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="group bg-slate-900 rounded-2xl p-4 border border-slate-100 hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200"
                    style={{ background: color + "15" }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-100 font-semibold text-sm truncate">{label}</p>
                    <p className="text-slate-400 text-xs truncate">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-200 text-xs font-bold uppercase tracking-widest">
                Recent Products
              </h2>
              <Link
                href="/admin/products"
                className="text-xs font-medium text-gold-500 hover:text-gold-600 transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {recentProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3.5 hover:bg-slate-800 transition-colors">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo})`,
                    }}
                  >
                    {p.brand[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-100 text-sm font-semibold truncate">
                      {p.brand} {p.model}
                    </p>
                    <p className="text-slate-400 text-xs">€{p.salePrice} · Grade {p.grade}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-slate-500 text-xs">{p.savings}% off</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Site status card */}
            <div className="mt-4 bg-gradient-to-br from-navy-950 to-navy-900 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/60 text-xs font-medium">Site Status</span>
              </div>
              <p className="text-white font-bold text-sm">{content.business.name}</p>
              <p className="text-white/40 text-xs mt-0.5">{content.business.address}</p>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/50 text-xs">{content.business.phone}</span>
                <span className="text-emerald-400 text-xs font-medium">● Live</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
