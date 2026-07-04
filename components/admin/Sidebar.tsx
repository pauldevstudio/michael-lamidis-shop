"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Package,
  FileText,
  ImageIcon,
  Palette,
  Search,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Users,
  ShoppingBag,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",           label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "Analytics",    icon: BarChart3 },
  { href: "/admin/orders",    label: "Orders",       icon: ShoppingBag },
  { href: "/admin/business",  label: "Business Info", icon: Building2 },
  { href: "/admin/products",  label: "Products",     icon: Package },
  { href: "/admin/content",   label: "Content",      icon: FileText },
  { href: "/admin/media",     label: "Media",        icon: ImageIcon },
  { href: "/admin/theme",     label: "Theme",        icon: Palette },
  { href: "/admin/seo",       label: "SEO",          icon: Search },
  { href: "/admin/leads",     label: "AI Leads",     icon: Users },
];

interface Props {
  /** Mobile only: whether the off-canvas drawer is open. */
  mobileOpen?: boolean;
  /** Close the mobile drawer (nav tap, backdrop, or the X). */
  onClose?: () => void;
}

/**
 * Admin sidebar. Responsive:
 *  - Desktop (lg+): a static column in the flex row, collapsible to icons.
 *  - Mobile (<lg): an off-canvas drawer that slides in over a backdrop; the
 *    `collapsed` state is ignored so the drawer is always full-width/labelled.
 */
export default function Sidebar({ mobileOpen = false, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    onClose?.();
    router.replace("/admin/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-60 border-r border-white/[0.06] transition-all duration-300",
          "lg:static lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[68px]" : "lg:w-60"
        )}
        style={{ background: "linear-gradient(180deg, #030813 0%, #060F2A 100%)" }}
      >
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute -right-3.5 top-20 z-50 w-7 h-7 rounded-full bg-navy-800 border border-white/10 items-center justify-center text-white/50 hover:text-white transition-colors shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Logo */}
        <div className={cn("flex items-center gap-3 p-5 pb-4 border-b border-white/[0.06]", collapsed && "lg:justify-center lg:px-3")}>
          <Image
            src="/logo.png"
            alt="Michael Lamidis logo"
            width={36}
            height={36}
            priority
            className="w-9 h-9 shrink-0"
          />
          <div className={cn("overflow-hidden", collapsed && "lg:hidden")}>
            <p className="text-white font-display font-bold text-sm leading-tight whitespace-nowrap">Michael Lamidis</p>
            <p className="text-white/30 text-[10px] font-medium whitespace-nowrap">Admin Panel</p>
          </div>
          {/* Mobile drawer close */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden ml-auto w-9 h-9 -mr-1 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className={cn("px-3 space-y-0.5")}>
            {NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                    active
                      ? "bg-gold-500/15 text-white"
                      : "text-white/45 hover:text-white/80 hover:bg-slate-900/[0.05]",
                    collapsed && "lg:justify-center lg:px-2"
                  )}
                  title={collapsed ? label : undefined}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-gold-400" />
                  )}
                  <Icon className={cn("shrink-0", active ? "text-gold-400" : "text-white/40 group-hover:text-white/70")} style={{width: "1.125rem", height: "1.125rem"}} />
                  <span className={cn("truncate", collapsed && "lg:hidden")}>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-3 my-3 border-t border-white/[0.06]" />

          {/* View Site */}
          <div className="px-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/45 hover:text-white/80 hover:bg-slate-900/[0.05] transition-all duration-200 group",
                collapsed && "lg:justify-center lg:px-2"
              )}
              title={collapsed ? "View Site" : undefined}
            >
              <ExternalLink className="w-[1.125rem] h-[1.125rem] shrink-0 text-white/40 group-hover:text-white/70" />
              <span className={cn(collapsed && "lg:hidden")}>View Site</span>
            </a>
          </div>
        </nav>

        {/* Bottom: Logout */}
        <div className="border-t border-white/[0.06] p-3 space-y-0.5">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 group",
              collapsed && "lg:justify-center lg:px-2"
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-[1.125rem] h-[1.125rem] shrink-0" />
            <span className={cn(collapsed && "lg:hidden")}>{loggingOut ? "Signing out…" : "Sign Out"}</span>
          </button>

          <div className={cn("mt-3 px-3 py-3 rounded-xl bg-slate-900/[0.03] border border-white/[0.06]", collapsed && "lg:hidden")}>
            <p className="text-white/50 text-xs font-medium">Signed in as</p>
            <p className="text-white/80 text-xs font-bold mt-0.5">Administrator</p>
          </div>
        </div>
      </aside>
    </>
  );
}
