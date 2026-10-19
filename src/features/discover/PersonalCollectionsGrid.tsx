"use client";

import { NewsCard } from "@/components/content/NewsCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { toast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import type { ContentItem } from "@/lib/types";
import { ArrowRight, Globe, Layers, Radio } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface PersonalCollectionsGridProps {
  news: ContentItem[];
}

const INITIAL_VISIBLE_COUNT = 9;
const STORIES_PAGE_STEP = 4;

export function PersonalCollectionsGrid({ news }: PersonalCollectionsGridProps) {
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [prevNews, setPrevNews] = useState(news);
  if (prevNews !== news) {
    setPrevNews(news);
    setVisibleStoriesCount(INITIAL_VISIBLE_COUNT);
  }

  if (news.length === 0) return null;

  const leadStory = news[0];
  const stackedStories = news.slice(1, 4);
  const tickerItems = news.slice(4, 9);
  const extraStories = news.slice(9, visibleStoriesCount);
  const hasMoreStories = visibleStoriesCount < news.length;

  const openTickerStory = (item: ContentItem) => {
    if (item.url && item.url.startsWith("http")) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      toast.info("Original publisher link is currently unavailable for this item.");
    }
  };

  return (
    <ScrollReveal distancePx={24} threshold={0.08} className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--theme-accent)]/15 text-[var(--theme-accent)]">
              <Layers className="h-4 w-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              Deep Dives & Frontier Stories
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            High-signal analysis, technology breakthroughs, and cultural trends.
          </p>
        </div>

        <Link
          href="/trending"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--theme-accent)] hover:underline"
        >
          <span>Explore All Stories</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 3-Column Modern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start pt-1">
        {/* Column 1: Lead Story (5 cols) */}
        {leadStory && (
          <div className="lg:col-span-5 h-full">
            <NewsCard item={leadStory} variant="lead" />
          </div>
        )}

        {/* Column 2: Stacked Briefs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {stackedStories.map((item) => (
            <NewsCard key={item.id} item={item} variant="compact" />
          ))}
        </div>

        {/* Column 3: Live Wire Broadcast Ticker (3 cols) */}
        <div className="lg:col-span-3 rounded-[1.8rem] border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div className="flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-fg">
                Live Broadcast Feed
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted">BBC Stream</span>
          </div>

          <div className="divide-y divide-border/60">
            {tickerItems.map((item) => (
              <article key={item.id} className="py-3.5 first:pt-3 last:pb-1 group">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase">
                  <span>{item.source}</span>
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openTickerStory(item)}
                  className="mt-1.5 text-left text-sm font-semibold text-fg leading-snug line-clamp-2 hover:text-[var(--theme-accent)] transition block w-full"
                >
                  {item.title}
                </button>
              </article>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-border/80 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
              <Globe className="h-3 w-3 text-emerald-500" />
              <span>Real-time global stream</span>
            </span>
          </div>
        </div>
      </div>

      {/* Extra Stories Loaded Incrementally */}
      {extraStories.length > 0 && (
        <div className="pt-4 space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted">
            Additional Dispatches ({extraStories.length} loaded)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extraStories.map((item) => (
              <NewsCard key={item.id} item={item} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Load More Stories Control */}
      {hasMoreStories && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
          <span className="font-mono text-xs text-muted">
            Showing {visibleStoriesCount} of {news.length} frontier stories
          </span>
          <button
            type="button"
            disabled={isLoadingMore}
            onClick={() => {
              setIsLoadingMore(true);
              setTimeout(() => {
                setVisibleStoriesCount((prev) => Math.min(prev + STORIES_PAGE_STEP, news.length));
                setIsLoadingMore(false);
              }, 200);
            }}
            className="rounded-full border border-border bg-card-strong px-5 py-2 text-xs font-semibold text-fg transition hover:bg-fg hover:text-bg disabled:opacity-50"
          >
            {isLoadingMore ? "Loading dispatches..." : `Load More Stories (${visibleStoriesCount} of ${news.length})`}
          </button>
        </div>
      )}
    </ScrollReveal>
  );
}
