"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { TiltCard } from "@/components/ui/TiltCard";
import { formatRelativeTime } from "@/lib/format";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { recordOpen } from "@/store/slices/preferencesSlice";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";
import React, { useState } from "react";
import { MovieTrailerModal } from "./MovieTrailerModal";

export function FeaturedCarousel({ items }: { items: ContentItem[] }) {
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const favorites = useAppSelector((state) => state.favorites.items);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex % items.length];
  const isMovie = currentItem.type === "movie";
  const saved = favorites.some((f) => f.id === currentItem.id);
  const rating = currentItem.metadata.rating ? currentItem.metadata.rating.toFixed(1) : null;
  const year = currentItem.metadata.year;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleOpen = () => {
    dispatch(recordOpen(currentItem.id));
    if (isMovie) {
      setShowTrailer(true);
    } else if (currentItem.url && currentItem.url.startsWith("http")) {
      window.open(currentItem.url, "_blank", "noopener,noreferrer");
    } else {
      toast.info("Original publisher story link is currently unavailable for this item.");
    }
  };

  return (
    <>
      <div className="relative">
        <TiltCard maxTilt={4} scale={1.008} glare={true}>
          <article className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl transition duration-500 card-tactile">
            {/* Ambient Background Glow based on content */}
            <div
              className={`pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl transition-colors duration-700 ${
                isMovie ? "bg-amber-500" : "bg-blue-600"
              }`}
            />

            <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
              {/* Left Editorial Content Area */}
              <div className="relative z-10 flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                <div>
                  {/* Top Badges & Carousel Counter */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${
                          isMovie
                            ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                            : "border-blue-500/30 text-blue-500 bg-blue-500/10"
                        }`}
                      >
                        {isMovie ? <Film className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                        {isMovie ? "CINEMA SPOTLIGHT" : "FEATURED COVER"}
                      </span>
                      <span className="font-semibold text-fg">{currentItem.source}</span>
                      <span>·</span>
                      <span className="text-muted">{formatRelativeTime(currentItem.publishedAt)}</span>
                    </div>

                    {/* Slide Navigation Numbers */}
                    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card-strong/60 px-2.5 py-1 font-mono text-[11px] text-muted">
                      <span>{currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}</span>
                      <span className="opacity-40">/</span>
                      <span>{items.length < 10 ? `0${items.length}` : items.length}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    onClick={handleOpen}
                    className="editorial mt-4 cursor-pointer text-3xl font-bold leading-[1.15] tracking-tight text-fg transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-4xl lg:text-5xl"
                  >
                    {currentItem.title}
                  </h2>

                  {/* Description excerpt */}
                  <p className="mt-3.5 line-clamp-2 max-w-xl text-sm leading-relaxed text-muted sm:line-clamp-3 sm:text-base">
                    {currentItem.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {rating && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Star className="h-3 w-3 fill-current" /> {rating}
                      </span>
                    )}
                    {year && (
                      <span className="rounded-full border border-border/80 bg-chip px-2.5 py-0.5 text-xs font-mono text-muted">
                        {year}
                      </span>
                    )}
                    {currentItem.categories.slice(0, 3).map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-border/60 bg-chip px-2.5 py-0.5 text-xs font-medium text-muted"
                      >
                        #{category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpen}
                      className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-md transition hover:scale-105 ${
                        isMovie
                          ? "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/25"
                          : "bg-ink text-paper dark:bg-paper dark:text-ink hover:opacity-90"
                      }`}
                    >
                      {isMovie ? (
                        <>
                          <Play className="h-4 w-4 fill-current" /> Play Trailer
                        </>
                      ) : (
                        <>
                          Read Article <ExternalLink className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        dispatch(toggleFavorite(currentItem));
                        toast.success(saved ? (isMovie ? "Removed from cinema watchlist" : "Removed from saved") : (isMovie ? "Added to cinema watchlist" : "Saved story for later"));
                      }}
                      className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-fg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
                    >
                      {saved ? (
                        <BookmarkCheck className="h-4 w-4 text-blue-600 dark:text-amber-400" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-muted" />
                      )}
                      <span>{saved ? "Saved" : "Save for later"}</span>
                    </button>
                  </div>

                  {/* Prev / Next controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous story"
                      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted hover:text-fg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next story"
                      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted hover:text-fg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Image Feature */}
              <div className="relative min-h-[320px] lg:min-h-full w-full overflow-hidden bg-black/50">
                <SafeImage
                  src={currentItem.image}
                  alt={currentItem.title}
                  category={currentItem.categories[0]}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-card lg:via-transparent lg:to-black/30" />

                {/* Floating category badge on image */}
                <div className="absolute bottom-4 right-4">
                  <span className="rounded-full bg-black/70 px-3 py-1 font-mono text-xs font-semibold text-white/90 backdrop-blur-md">
                    {currentItem.categories[0] ?? "Featured"}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </TiltCard>
      </div>

      {showTrailer && isMovie && (
        <MovieTrailerModal item={currentItem} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
}
