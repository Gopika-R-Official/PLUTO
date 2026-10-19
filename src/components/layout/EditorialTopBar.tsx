"use client";

import { useAppSelector } from "@/store/hooks";
import { Bookmark, Compass, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface EditorialTopBarProps {
  onOpenSearch: () => void;
}

export function EditorialTopBar({ onOpenSearch }: EditorialTopBarProps) {
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full pt-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08] mb-6 sm:mb-8">
      <div className="flex items-center justify-between gap-3 text-xs">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5 text-inherit">
            <span className="relative grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-tr from-[var(--theme-accent)] to-purple-500 text-white shadow-sm shadow-[var(--theme-accent)]/30 group-hover:scale-105 transition">
              <Compass className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-black" />
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-900 dark:text-white leading-none">
                Pluto
              </span>
              <span className="text-[10px] font-medium tracking-wide text-neutral-400 dark:text-neutral-500 uppercase">
                Discovery Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200/90 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-[var(--theme-accent)]/50 transition font-mono text-[11px] shadow-xs"
          >
            <Search className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
            <span className="hidden sm:inline">Search cinema, music, stories</span>
            <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[9px] font-semibold text-neutral-600 dark:text-neutral-300">
              ⌘K
            </span>
          </button>


          {/* Quick Favorites Access */}
          <Link
            href="/favorites"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-600 dark:text-neutral-300 font-medium"
            title="Saved in your library"
          >
            <Bookmark className="h-3 w-3 text-blue-500" />
            <span>Saved</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                {favoritesCount}
              </span>
            )}
          </Link>

          {timeString && (
            <span className="hidden lg:inline-block font-mono text-[10px] tabular-nums text-neutral-400 pl-1">
              {timeString}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
