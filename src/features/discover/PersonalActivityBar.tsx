"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { useAppSelector } from "@/store/hooks";
import { ArrowRight, Bookmark, Compass, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

export function PersonalActivityBar() {
  const favorites = useAppSelector((state) => state.favorites.items);
  const groups = useAppSelector((state) => state.together.groups);
  const openCounts = useAppSelector((state) => state.preferences.openCounts);

  const totalOpened = Object.values(openCounts).reduce((acc, count) => acc + count, 0);

  return (
    <section
      aria-label="Personal Activity and Quick Access"
      className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Saved Library Quick Access */}
        <div className="flex flex-col justify-between pt-2 md:pt-0 md:px-3 first:px-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-fg">
              <Bookmark className="h-3.5 w-3.5 text-blue-500" />
              <span>Watchlist & Saved</span>
            </span>
            <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              {favorites.length} {favorites.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="my-2 flex items-center gap-2 overflow-x-auto py-1">
            {favorites.length === 0 ? (
              <span className="text-xs text-muted">No items saved yet</span>
            ) : (
              favorites.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-card-strong border border-border"
                  title={f.item.title}
                >
                  <SafeImage
                    src={f.item.image}
                    alt={f.item.title}
                    category={f.item.categories[0]}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            )}
          </div>

          <Link
            href="/favorites"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
          >
            <span>Open Library</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Discovery Circles Quick Access */}
        <div className="flex flex-col justify-between pt-3 md:pt-0 md:px-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-fg">
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              <span>Shared with Friends</span>
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {groups.length} Circles
            </span>
          </div>

          <div className="my-2 flex items-center gap-2">
            {groups.slice(0, 3).map((g) => (
              <Link
                key={g.id}
                href={`/together/${g.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-chip px-2.5 py-1 text-[11px] font-medium text-fg hover:border-emerald-500/50 transition truncate max-w-[140px]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{g.name}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/together"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:underline"
          >
            <span>View Together Rooms</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Exploration Signal Quick Stats */}
        <div className="flex flex-col justify-between pt-3 md:pt-0 md:px-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-fg">
              <Compass className="h-3.5 w-3.5 text-amber-500" />
              <span>Discovery Signals</span>
            </span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {totalOpened} Explored
            </span>
          </div>

          <p className="my-2 text-xs text-muted leading-relaxed">
            Your clicks and watchlist actions dynamically train your personalized feed.
          </p>

          <Link
            href="/my-space"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 hover:underline"
          >
            <span>My Space Preferences</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
