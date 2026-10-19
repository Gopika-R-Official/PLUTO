"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "@/components/ui/Toast";
import { handleReserveRestaurant } from "@/lib/booking";
import { shareContent } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Share2, Star, Utensils } from "lucide-react";
import React from "react";

interface RestaurantCardProps {
  item: ContentItem;
}

export function RestaurantCard({ item }: RestaurantCardProps) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((f) => f.id === item.id),
  );

  const rating = item.metadata?.rating ? item.metadata.rating.toFixed(1) : null;
  const cuisine = item.metadata?.cuisine || "Fine Dining";
  const location = item.metadata?.locationLabel || "Global";
  const price = item.metadata?.priceLevel || "$$$";

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
    toast.success(saved ? `Removed "${item.title}" from saved` : `Saved "${item.title}"`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareContent(item);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      toast.info(`Viewing details for ${item.title}`);
    }
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-black/[0.06] dark:border-white/10 bg-white/75 dark:bg-[#0c101d]/85 backdrop-blur-xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/40">
      {/* Visual Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <SafeImage
          src={item.image}
          alt={item.title}
          category="Travel"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400">
            <Star className="h-3 w-3 fill-current" />
            <span>{rating}</span>
          </span>

          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 font-semibold">
            {price}
          </span>
        </div>

        {/* Bottom Location Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-1 text-[11px] font-medium text-white/80 drop-shadow">
          <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Info & Booking Strip */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <Utensils className="h-3 w-3" />
              <span>{cuisine}</span>
            </span>
          </div>

          <h3 className="font-bold text-base text-neutral-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.08] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleReserveRestaurant(item)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
          >
            <span>Book Table</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleView}
              aria-label="View restaurant"
              title="View restaurant"
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={saved ? "Remove saved restaurant" : "Save restaurant"}
              className="p-1.5 rounded-full text-neutral-400 hover:text-rose-500 transition cursor-pointer"
            >
              {saved ? (
                <BookmarkCheck className="h-3.5 w-3.5 text-rose-500" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share restaurant"
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
