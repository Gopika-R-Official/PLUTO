"use client";

import { SUGGESTED_INTERESTS } from "@/lib/constants";
import type { Interest, PreferencesState } from "@/lib/types";
import { Plus, Settings2, SlidersHorizontal, Sparkles, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface DiscoverWelcomeBarProps {
  preferences: PreferencesState;
  onOpenOrganizer: () => void;
  onToggleInterest: (interest: Interest) => void;
}

export function DiscoverWelcomeBar({
  preferences,
  onOpenOrganizer,
  onToggleInterest,
}: DiscoverWelcomeBarProps) {
  const activeInterests = preferences.interests;
  const activeCount = activeInterests.length;
  const name = preferences.displayName?.trim() || "Explorer";

  return (
    <section
      aria-label="Personal Discovery Dashboard Header"
      className="space-y-3.5 pb-4 pt-1 border-b border-border/80"
    >
      {/* Top Row: Greeting & Feed Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Personalized Greeting */}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
            Welcome back, <span className="text-[var(--theme-accent,#6366f1)]">{name}</span>
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-accent-muted,rgba(99,102,241,0.12))] px-3 py-1 text-xs font-semibold text-[var(--theme-accent,#6366f1)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {activeCount === 0
                ? "Broad Radar (No Filters)"
                : `${activeCount} ${activeCount === 1 ? "Active Topic" : "Active Topics"}`}
            </span>
          </span>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenOrganizer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-card-strong text-fg text-xs font-medium shadow-xs transition"
            title="Reorder modules in your discovery stream"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--theme-accent,#6366f1)]" />
            <span className="hidden xs:inline">Customize Feed</span>
          </button>

          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-card-strong text-muted hover:text-fg text-xs font-medium shadow-xs transition"
            title="Edit display name and topic spectrum in Settings"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preferences</span>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Selected Interests & Topic Selector Section */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
              Your Radar Interests:
            </span>
            {activeCount > 0 ? (
              <span className="text-muted text-[11px]">
                (Shaping live news feeds, cinema recommendations, and ranking order)
              </span>
            ) : (
              <span className="text-amber-500 text-[11px] font-medium">
                No active topics. Showing unweighted general discoveries.
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-muted">
            Click to toggle · Instant re-ranking
          </span>
        </div>

        {/* Category Pills Group */}
        <div
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
          role="group"
          aria-label="Filter feed by interest"
        >
          {SUGGESTED_INTERESTS.map((interest) => {
            const active = activeInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => onToggleInterest(interest)}
                aria-pressed={active}
                className={`group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 sm:px-3 sm:py-1 min-h-[38px] sm:min-h-0 text-xs font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent,#6366f1)] ${
                  active
                    ? "bg-[var(--theme-accent,#6366f1)] text-white shadow-xs"
                    : "bg-chip text-muted hover:text-fg hover:bg-chip-hover"
                }`}
                title={`Toggle ${interest} recommendations`}
              >
                <span>{interest}</span>
                {active ? (
                  <X className="h-3 w-3 opacity-80 group-hover:opacity-100" />
                ) : (
                  <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
