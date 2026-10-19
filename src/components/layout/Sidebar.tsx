"use client";

import { Logo } from "@/components/brand/Logo";
import { NAV_ITEMS } from "@/components/layout/nav";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const interests = useAppSelector((state) => state.preferences.interests);

  return (
    <aside className="sticky top-0 hidden h-screen w-[256px] shrink-0 flex-col justify-between border-r border-border bg-card/80 backdrop-blur-xl px-5 py-7 lg:flex z-20">
      <div>
        <Logo />

        {/* Live System Indicator */}
        <div className="mt-7 flex items-center gap-2.5 rounded-xl border border-border/80 bg-black/[0.02] dark:bg-white/[0.03] px-3.5 py-2 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono uppercase tracking-wider text-[10px] font-semibold text-slate-700 dark:text-slate-300">
            Discovery Live
          </span>
          <span className="ml-auto text-slate-400 dark:text-slate-500 text-[10px]">v2.4</span>
        </div>

        {/* Navigation Menu */}
        <nav aria-label="Primary" className="mt-8 flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active
                    ? "bg-blue-600/[0.08] dark:bg-white/[0.08] border border-blue-600/20 dark:border-white/15 text-blue-900 dark:text-white font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                  }`}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)] dark:shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Active Personalization Footnote */}
      <div className="rounded-2xl border border-border bg-black/[0.02] dark:bg-white/[0.03] p-4">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
          Personalized Spectrum
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="rounded-md border border-border/80 bg-card text-slate-800 dark:text-slate-200 px-2 py-0.5 text-[10px] font-medium shadow-2xs"
            >
              {interest}
            </span>
          ))}
          {interests.length > 3 && (
            <span className="rounded-md bg-chip px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              +{interests.length - 3}
            </span>
          )}
        </div>
        <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Shaping recommendations, editorial layouts, and lounge rooms.
        </p>
      </div>
    </aside>
  );
}
