"use client";

import type { ContentItem } from "@/lib/types";
import { ActivityCard } from "./ActivityCard";
import { MovieCard } from "./MovieCard";
import { MusicCard } from "./MusicCard";
import { NewsCard } from "./NewsCard";
import { RestaurantCard } from "./RestaurantCard";
import { SocialCard } from "./SocialCard";

export function ContentCard({
  item,
  variant,
}: {
  item: ContentItem;
  variant?: "default" | "horizontal" | "poster" | "spotlight" | "social" | "lead";
}) {
  if (item.type === "movie") {
    const movieVariant = variant === "spotlight" ? "spotlight" : "poster";
    return <MovieCard item={item} variant={movieVariant} />;
  }

  if (item.type === "music") {
    return <MusicCard item={item} />;
  }

  if (item.type === "social") {
    return <SocialCard item={item} />;
  }

  if (item.type === "activity" || item.type === "place") {
    return <ActivityCard item={item} />;
  }

  if (item.type === "restaurant") {
    return <RestaurantCard item={item} />;
  }

  // Default to NewsCard
  const newsVariant = variant === "lead" ? "lead" : "editorial";
  return <NewsCard item={item} variant={newsVariant} />;
}
