"use client";

import { MovieTrailerModal } from "@/components/content/MovieTrailerModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "@/components/ui/Toast";
import { shareContent } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { Bookmark, ChevronRight, Compass, Film, Share2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface TrendingItem {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  image: string;
  type: "movie" | "news" | "music";
  itemRef?: ContentItem;
}

interface TrendingQuickPanelProps {
  featuredItem?: ContentItem;
}

const DEFAULT_TRENDING: TrendingItem[] = [
  {
    id: "trend-1",
    rank: 1,
    title: "Interstellar",
    subtitle: "Movie • 2014",
    image: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    type: "movie",
  },
  {
    id: "trend-2",
    rank: 2,
    title: "The Last of Us",
    subtitle: "TV Show • 2023",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    type: "movie",
  },
  {
    id: "trend-3",
    rank: 3,
    title: "Taylor Swift",
    subtitle: "Artist • Music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    type: "music",
  },
  {
    id: "trend-4",
    rank: 4,
    title: "Space Exploration",
    subtitle: "Topic • News",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    type: "news",
  },
  {
    id: "trend-5",
    rank: 5,
    title: "Technology",
    subtitle: "Topic • News",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    type: "news",
  },
];

export function TrendingQuickPanel({ featuredItem }: TrendingQuickPanelProps) {
  const dispatch = useAppDispatch();
  const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null);

  const handleItemClick = (item: TrendingItem) => {
    if (item.type === "movie" || item.title.includes("Interstellar")) {
      setSelectedMovie(
        item.itemRef ?? {
          id: "movie-157336",
          type: "movie",
          title: item.title,
          description: "A journey beyond time and space for a better tomorrow.",
          image: item.image,
          categories: ["Movies", "Science"],
          source: "TMDB",
          url: "https://www.themoviedb.org/movie/157336",
          publishedAt: new Date().toISOString(),
          provenance: "mock",
          metadata: {
            rating: 8.4,
            year: 2014,
            trailerKey: "zSWdZVtXT7E",
          },
        },
      );
    } else {
      toast.info(`Viewing ${item.title} (${item.subtitle})`);
    }
  };

  const handleSaveForLater = () => {
    if (featuredItem) {
      dispatch(toggleFavorite(featuredItem));
      toast.success(`Saved "${featuredItem.title}" to library!`);
    } else {
      toast.info("Opened saved items library.");
    }
  };

  const handleShareDashboard = async () => {
    if (typeof window !== "undefined") {
      await shareContent({
        id: "pluto-dashboard",
        type: "news",
        title: "Pluto — Personalized Intelligence & Cinematic Discovery",
        description: "Explore personalized cinema trailers, breaking tech intelligence, and sonic dispatches.",
        image: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        categories: ["Technology", "Movies"],
        source: "Pluto Hub",
        url: window.location.href,
        publishedAt: new Date().toISOString(),
        provenance: "live",
        metadata: {},
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* Trending Now Card */}
        <div className="rounded-[1.8rem] p-4 sm:p-5 backdrop-blur-2xl bg-white/80 dark:bg-[#0c101d]/85 border border-black/[0.06] dark:border-white/10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] transition-all duration-300">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/[0.05] dark:border-white/[0.08]">
            <h3 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span>Trending Now</span>
            </h3>
            <Link
              href="/trending"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center gap-0.5"
            >
              <span>See all</span>
            </Link>
          </div>

          <div className="flex flex-col gap-1.5" role="list">
            {DEFAULT_TRENDING.map((trend) => (
              <div
                key={trend.id}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(trend)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(trend);
                  }
                }}
                className="group flex items-center gap-3 p-2 rounded-2xl cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {/* Rank Number */}
                <span className="font-semibold text-xs text-neutral-400 dark:text-neutral-500 w-3 text-center tabular-nums">
                  {trend.rank}
                </span>

                {/* Thumbnail */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                  <SafeImage
                    src={trend.image}
                    alt={trend.title}
                    category="Movies"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {trend.title}
                  </p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                    {trend.subtitle}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 shrink-0 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-[1.8rem] p-4 sm:p-5 backdrop-blur-2xl bg-white/80 dark:bg-[#0c101d]/85 border border-black/[0.06] dark:border-white/10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] transition-all duration-300">
          <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2.5">
            Quick Actions
          </p>

          <div className="flex flex-col gap-1.5">
            {/* Save for Later Action */}
            <button
              type="button"
              onClick={handleSaveForLater}
              className="group flex items-center justify-between w-full p-2.5 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  <Bookmark className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Save for Later
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
            </button>

            {/* Share Dashboard Action */}
            <button
              type="button"
              onClick={handleShareDashboard}
              className="group flex items-center justify-between w-full p-2.5 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                  <Share2 className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Share Dashboard
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
            </button>

            {/* Explore Discover Action */}
            <Link
              href="/discover"
              className="group flex items-center justify-between w-full p-2.5 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Compass className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Explore Discover
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
            </Link>

            {/* Find Movies Action */}
            <Link
              href="/movies"
              className="group flex items-center justify-between w-full p-2.5 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <Film className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Find Movies
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </div>

      {selectedMovie && (
        <MovieTrailerModal
          item={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
