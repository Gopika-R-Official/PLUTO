"use client";

import { MovieTrailerModal } from "@/components/content/MovieTrailerModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { TiltCard } from "@/components/ui/TiltCard";
import { toast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import { shareContent } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { recordOpen } from "@/store/slices/preferencesSlice";
import { shareToGroup } from "@/store/slices/togetherSlice";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Play,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import React, { useState } from "react";

interface CinematicDiscoveryStageProps {
  items: ContentItem[];
}

export function CinematicDiscoveryStage({ items }: CinematicDiscoveryStageProps) {
  const dispatch = useAppDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const favorites = useAppSelector((state) => state.favorites.items);
  const groups = useAppSelector((state) => state.together.groups);

  if (!items || items.length === 0) return null;

  const currentItem = items[selectedIndex % items.length];
  const isMovie = currentItem.type === "movie";
  const saved = favorites.some((f) => f.id === currentItem.id);
  const rating = currentItem.metadata.rating ? currentItem.metadata.rating.toFixed(1) : null;
  const year = currentItem.metadata.year;

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

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(currentItem));
    if (typeof window !== "undefined") {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: currentItem }),
      }).catch(() => {});
    }
    if (saved) {
      toast.success(isMovie ? "Removed from cinema watchlist" : "Removed from saved stories");
    } else {
      toast.success(isMovie ? "Added to cinema watchlist" : "Saved story for later");
    }
  };

  const handleNativeShare = async () => {
    await shareContent(currentItem);
  };

  const prevItem = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const nextItem = () => {
    setSelectedIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <>
      <section aria-label="Cinematic Discovery Spotlight" className="relative w-full">
        <TiltCard maxTilt={3} scale={1.008} glare={false} className="w-full">
          <article className="group relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.6rem] border border-black/10 dark:border-white/10 bg-gradient-to-br from-[#0c0e17] via-[#121524] to-[#181528] text-white shadow-2xl transition duration-500 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_25px_60px_-15px_var(--theme-accent-glow)]">
            {/* Dynamic ambient background glow */}
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl transition-colors duration-700"
              style={{ background: isMovie ? "var(--theme-accent)" : "#6366f1" }}
            />

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] min-h-[440px] sm:min-h-[480px]">
              {/* Content Panel */}
              <div className="relative z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
                <div>
                  {/* Top Badges & Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/30 px-3 py-1 text-[11px] font-bold text-[var(--theme-accent)] tracking-wider uppercase backdrop-blur-md">
                        {isMovie ? <Film className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                        {isMovie ? "Cinema Spotlight" : "Featured Pick"}
                      </span>
                      <span className="font-semibold text-white/90">{currentItem.source}</span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/60">{formatRelativeTime(currentItem.publishedAt)}</span>
                    </div>

                    {/* Multi-item selector pills & chevrons */}
                    {items.length > 1 && (
                      <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-md">
                        <button
                          type="button"
                          onClick={prevItem}
                          aria-label="Previous discovery"
                          className="p-1 rounded-full text-white/60 hover:text-white transition"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </button>
                        {items.slice(0, 4).map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedIndex(idx)}
                            aria-label={`Highlight discovery ${idx + 1}: ${item.title}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              selectedIndex === idx
                                ? "w-6 bg-[var(--theme-accent)]"
                                : "w-2 bg-white/30 hover:bg-white/60"
                            }`}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={nextItem}
                          aria-label="Next discovery"
                          className="p-1 rounded-full text-white/60 hover:text-white transition"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2
                    onClick={handleOpen}
                    className="mt-4 sm:mt-6 cursor-pointer text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white transition-colors group-hover:text-[var(--theme-accent)] leading-[1.12]"
                  >
                    {currentItem.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-3.5 line-clamp-3 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                    {currentItem.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {rating && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                        <Star className="h-3 w-3 fill-current" /> {rating}
                      </span>
                    )}
                    {year && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-mono text-white/70">
                        {year}
                      </span>
                    )}
                    {currentItem.categories.slice(0, 3).map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300"
                      >
                        #{category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen();
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="cursor-pointer relative z-30 flex items-center gap-2 rounded-full bg-[var(--theme-accent)] hover:brightness-110 text-white px-6 py-2.5 text-sm font-bold shadow-lg shadow-[var(--theme-accent)]/30 transition active:scale-95"
                    >
                      {isMovie ? (
                        <>
                          <Play className="h-4 w-4 fill-current" /> Watch Trailer
                        </>
                      ) : (
                        <>
                          Explore Story <ExternalLink className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite();
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="cursor-pointer relative z-30 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15 active:scale-95"
                    >
                      {saved ? (
                        <BookmarkCheck className="h-4 w-4 text-[var(--theme-accent)]" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-white/80" />
                      )}
                      <span>{saved ? (isMovie ? "In Watchlist" : "Saved") : (isMovie ? "Add to Watchlist" : "Save for Later")}</span>
                    </button>

                    <button
                      type="button"
                      aria-label="Share story"
                      title="Share story"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareOpen((prev) => !prev);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="cursor-pointer relative z-30 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition hover:bg-white/15 hover:text-white active:scale-95"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Imagery */}
              <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-full w-full overflow-hidden bg-black/60">
                <SafeImage
                  src={currentItem.image}
                  alt={currentItem.title}
                  category={currentItem.categories[0]}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0c0e17] lg:via-transparent lg:to-black/30" />

                {/* Floating Content Type Pill */}
                <div className="absolute bottom-4 right-4">
                  <span className="rounded-full bg-black/75 px-3 py-1 font-mono text-xs font-semibold text-white/90 backdrop-blur-md border border-white/10">
                    {currentItem.categories[0] ?? "Spotlight"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Share to Together & Native Share Dropdown */}
            {shareOpen && (
              <div className="border-t border-white/10 bg-black/85 backdrop-blur-lg p-5 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-4 py-2 text-xs font-bold text-white transition hover:brightness-110"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Copy Link / Native Share
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Or Share with a Discovery Circle:
                  </p>
                  {groups.length === 0 ? (
                    <p className="mt-1 text-xs text-slate-400">Join or create a Together group to share.</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {groups.map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => {
                            dispatch(shareToGroup({ groupId: group.id, item: currentItem }));
                            setShareOpen(false);
                            toast.success(`Shared to ${group.name}!`);
                          }}
                          className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white hover:bg-[var(--theme-accent)] transition"
                        >
                          Share to {group.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>
        </TiltCard>
      </section>

      {/* Real Trailer Modal */}
      {showTrailer && isMovie && (
        <MovieTrailerModal item={currentItem} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
}
