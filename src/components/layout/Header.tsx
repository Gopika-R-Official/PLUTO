"use client";

import { Logo } from "@/components/brand/Logo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Bell, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const name = useAppSelector((state) => state.preferences.displayName);
  const activities = useAppSelector((state) => state.together.activities);
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [openActivity, setOpenActivity] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = query.trim();
      if (next.length >= 2) {
        router.push(`/search?q=${encodeURIComponent(next)}`);
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [query, router]);

  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [name],
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <div className="lg:hidden">
          <Logo compact />
        </div>
        <form
          className="relative min-w-0 flex-1"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            if (query.trim().length >= 2) {
              router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            }
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <label htmlFor={searchId} className="sr-only">
            Search news, movies, and posts
          </label>
          <input
            id={searchId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news, films, posts..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-fg outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </form>
        <button
          type="button"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => dispatch(toggleTheme())}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-slate-700 dark:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="relative">
          <button
            type="button"
            aria-expanded={openActivity}
            aria-label="Activity"
            onClick={() => setOpenActivity((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-slate-700 dark:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
          >
            <Bell className="h-4 w-4" />
          </button>
          {openActivity && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-card p-3 shadow-lg z-50">
              <p className="text-xs uppercase tracking-[0.14em] text-muted font-semibold">Activity</p>
              <ul className="mt-2 max-h-64 space-y-2 overflow-auto text-sm">
                {activities.length === 0 ? (
                  <li className="text-muted text-xs">No local activity yet.</li>
                ) : (
                  activities.slice(0, 8).map((event) => (
                    <li key={event.id} className="leading-5 text-muted text-xs">
                      {event.text}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        <Link
          href="/settings"
          className="hidden items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3.5 sm:flex text-fg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600/[0.1] text-blue-700 dark:bg-white/[0.1] dark:text-blue-300 font-semibold text-xs">
            {initials}
          </span>
          <span className="text-sm font-medium">{name}</span>
        </Link>
      </div>
    </header>
  );
}
