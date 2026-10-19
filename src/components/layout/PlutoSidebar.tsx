"use client";

import {
  ArrowRight,
  Bookmark,
  Compass,
  Disc3,
  Film,
  Home,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface PlutoSidebarProps {
  onOpenOrganizer?: () => void;
}

export function PlutoSidebar({ onOpenOrganizer }: PlutoSidebarProps) {
  const pathname = usePathname();

  const NAV_LINKS = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Discover",
      href: "/discover",
      icon: Compass,
      isActive: pathname === "/discover",
    },
    {
      label: "Music",
      href: "/music",
      icon: Disc3,
      isActive: pathname === "/music",
    },
    {
      label: "My Space",
      href: "/my-space",
      icon: Sparkles,
      isActive: pathname === "/my-space",
    },
    {
      label: "Cinema",
      href: "/movies",
      icon: Film,
      isActive: pathname === "/movies",
    },
    {
      label: "Trending",
      href: "/trending",
      icon: Newspaper,
      isActive: pathname === "/trending",
    },
    {
      label: "Together",
      href: "/together",
      icon: Users,
      isActive: pathname.startsWith("/together"),
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: Bookmark,
      isActive: pathname === "/favorites",
    },
  ];

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="hidden lg:flex flex-col justify-between w-[210px] xl:w-[230px] shrink-0 sticky top-5 h-[calc(100vh-2.5rem)] rounded-[2.2rem] p-5 z-30 transition-all duration-300 backdrop-blur-2xl bg-[var(--card)]/90 border border-[var(--border)] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]"
    >
      <div className="flex flex-col">
        {/* Pluto Wordmark */}
        <Link href="/" className="px-2 pt-1 pb-6 flex items-center gap-2 group">
          <span className="font-extrabold text-2xl tracking-tight text-[var(--fg)] group-hover:text-[var(--theme-accent)] transition">
            Pluto
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5" aria-label="Main menu">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 select-none ${
                  active
                    ? "bg-[var(--card-strong)] text-[var(--theme-accent)] dark:text-white font-semibold border border-[var(--theme-accent)]/20 dark:border-indigo-500/40 shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    active
                      ? "text-[var(--theme-accent)] dark:text-indigo-400 scale-105"
                      : "text-[var(--muted)]"
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Gradient Card: 'Your world, curated.' */}
      <div
        onClick={onOpenOrganizer}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenOrganizer?.();
          }
        }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(168, 85, 247, 0.75) 50%, rgba(59, 130, 246, 0.85) 100%)",
        }}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-white leading-tight">
              Your world,
            </p>
            <p className="text-[11px] font-bold text-white/90 leading-tight">
              curated.
            </p>
          </div>
          <div className="grid h-7 w-7 place-items-center rounded-full bg-white/20 backdrop-blur-md text-white transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Ambient sheen */}
        <div className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>
    </aside>
  );
}
