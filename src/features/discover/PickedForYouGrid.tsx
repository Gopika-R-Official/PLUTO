"use client";

import { MovieCard } from "@/components/content/MovieCard";
import { MusicCard } from "@/components/content/MusicCard";
import { NewsCard } from "@/components/content/NewsCard";
import { RestaurantCard } from "@/components/content/RestaurantCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MOCK_RESTAURANTS } from "@/lib/mock/restaurants";
import type { ContentItem } from "@/lib/types";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PickedForYouGridProps {
  movieItem?: ContentItem;
  newsItem?: ContentItem;
  musicItem?: ContentItem;
  restaurantItem?: ContentItem;
  socialItem?: ContentItem;
}

export function PickedForYouGrid({
  movieItem,
  newsItem,
  musicItem,
  restaurantItem,
}: PickedForYouGridProps) {
  const activeRestaurant = restaurantItem ?? MOCK_RESTAURANTS[0];

  return (
    <ScrollReveal distancePx={24} threshold={0.08} className="space-y-4">
      {/* Header matching the reference */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Picked for You
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Based on your interests and recent activity
          </p>
        </div>
        <Link
          href="/discover"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 4 Multi-Category Content Cards matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* 1. Movie Recommendation */}
        {movieItem && (
          <div className="flex flex-col">
            <MovieCard item={movieItem} variant="compact" />
          </div>
        )}

        {/* 2. Tech / News Recommendation */}
        {newsItem && (
          <div className="flex flex-col">
            <NewsCard item={newsItem} variant="editorial" />
          </div>
        )}

        {/* 3. Music Recommendation */}
        {musicItem && (
          <div className="flex flex-col">
            <MusicCard item={musicItem} />
          </div>
        )}

        {/* 4. Restaurant Recommendation with Book Table action */}
        {activeRestaurant && (
          <div className="flex flex-col">
            <RestaurantCard item={activeRestaurant} />
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
