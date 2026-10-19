"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { TiltCard } from "@/components/ui/TiltCard";
import { toast } from "@/components/ui/Toast";
import { handleBookMovieTickets } from "@/lib/booking";
import { shareContent, shareToPlatform } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { adjustTopic, dismissItem } from "@/store/slices/preferencesSlice";
import { shareToGroup } from "@/store/slices/togetherSlice";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Film,
  Info,
  Minus,
  Play,
  Plus,
  Share2,
  Star,
  Ticket,
  X,
} from "lucide-react";
import { useState } from "react";
import { MovieTrailerModal } from "./MovieTrailerModal";

export function MovieCard({
  item,
  variant = "poster",
}: {
  item: ContentItem;
  variant?: "poster" | "spotlight" | "compact";
}) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((record) => record.id === item.id),
  );
  const groups = useAppSelector((state) => state.together.groups);
  const [showModal, setShowModal] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const rating = item.metadata.rating ? item.metadata.rating.toFixed(1) : null;
  const year = item.metadata.year;

  const handleToggleFavorite = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(toggleFavorite(item));
    // Synchronize with server-side /api/favorites endpoint
    if (typeof window !== "undefined") {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      }).catch(() => {});
    }
    toast.success(saved ? "Removed from cinema watchlist" : "Added to cinema watchlist");
  };

  const handleShare = async () => {
    await shareContent(item);
  };

  const handleAdjustTopic = (delta: 1 | -1) => {
    dispatch(adjustTopic({ topic: "Movies", delta }));
    toast.info(delta > 0 ? "Showing more cinema titles" : "Showing fewer cinema titles");
  };

  const handleDismiss = () => {
    dispatch(dismissItem(item.id));
    toast.info("Movie hidden from radar");
  };

  if (variant === "spotlight") {
    return (
      <>
        <TiltCard maxTilt={3} scale={1.01} className="w-full">
          <article className="group relative overflow-hidden rounded-[2.2rem] border border-amber-500/20 bg-gradient-to-t from-black via-[#161311] to-[#251e19] text-white shadow-2xl transition hover:border-amber-500/40">
            <div className="relative min-h-[380px] sm:min-h-[420px] aspect-[16/9] sm:aspect-[21/9] max-h-[500px] w-full overflow-hidden">
              <SafeImage
                src={item.image}
                alt={item.title}
                category="Movies"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />

              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 pointer-events-auto">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 font-bold text-black shadow-md">
                    <Film className="h-3 w-3" /> FEATURED FILM
                  </span>
                  {rating && (
                    <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 font-medium text-amber-400 backdrop-blur">
                      <Star className="h-3 w-3 fill-current" /> {rating}
                    </span>
                  )}
                  {year && (
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-white/80 backdrop-blur">
                      {year}
                    </span>
                  )}
                </div>

                <h2
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  className="editorial mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl cursor-pointer hover:text-amber-400 transition"
                >
                  {item.title}
                </h2>

                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80 sm:line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 relative z-30 pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="cursor-pointer relative z-30 flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 text-sm font-bold shadow-lg shadow-amber-500/25 transition active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Play Trailer
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookMovieTickets(item.title, item.metadata?.year);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="cursor-pointer relative z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition active:scale-95"
                  >
                    <Ticket className="h-4 w-4 text-amber-300" />
                    <span>Book Tickets</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="cursor-pointer relative z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 active:scale-95"
                  >
                    {saved ? (
                      <BookmarkCheck className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    <span>{saved ? "In Watchlist" : "Add to Watchlist"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareOpen((open) => !open);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="cursor-pointer relative z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 active:scale-95"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="cursor-pointer relative z-30 rounded-full border border-white/15 bg-black/40 p-2.5 text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white active:scale-95"
                    title="Movie Details"
                    aria-label="Movie Details"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>

                {shareOpen && (
                  <div className="mt-4 rounded-2xl border border-white/15 bg-black/85 backdrop-blur-md p-4 text-xs space-y-3">
                    <p className="font-semibold text-white/70 uppercase tracking-wider text-[10px]">
                      Share via Social Channels or Copy Direct Link:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => shareToPlatform(item, "twitter")}
                        className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white font-medium transition"
                      >
                        𝕏 / Twitter
                      </button>
                      <button
                        type="button"
                        onClick={() => shareToPlatform(item, "whatsapp")}
                        className="rounded-full bg-emerald-600/30 border border-emerald-500/40 hover:bg-emerald-600/50 px-3 py-1.5 text-emerald-300 font-medium transition"
                      >
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => shareToPlatform(item, "reddit")}
                        className="rounded-full bg-orange-600/30 border border-orange-500/40 hover:bg-orange-600/50 px-3 py-1.5 text-orange-300 font-medium transition"
                      >
                        Reddit
                      </button>
                      <button
                        type="button"
                        onClick={() => shareToPlatform(item, "linkedin")}
                        className="rounded-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/50 px-3 py-1.5 text-blue-300 font-medium transition"
                      >
                        LinkedIn
                      </button>
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 font-bold text-black transition"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        </TiltCard>

        {showModal && <MovieTrailerModal item={item} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <TiltCard maxTilt={3} scale={1.01} className="w-full">
          <article className="group relative flex gap-3.5 p-3 rounded-2xl border border-border bg-card shadow-xs hover:shadow-md transition">
            <div
              onClick={() => setShowModal(true)}
              className="relative w-20 sm:w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden bg-muted/20 cursor-pointer"
            >
              <SafeImage
                src={item.image}
                alt={item.title}
                category="Movies"
                className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
              />
              {rating && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md font-mono text-[9px] text-amber-400 flex items-center gap-0.5">
                  <Star className="h-2 w-2 fill-current" />
                  <span>{rating}</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase">
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <Film className="h-3 w-3" />
                    <span>Cinema Vignette</span>
                  </span>
                  <span>{year ?? "Film"}</span>
                </div>

                <h4
                  onClick={() => setShowModal(true)}
                  className="font-serif text-sm font-semibold text-fg mt-1 cursor-pointer hover:text-amber-500 leading-snug line-clamp-1 transition"
                >
                  {item.title}
                </h4>

                <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-1 font-medium text-amber-500 hover:text-amber-400 transition"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Trailer</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                    className="p-1 rounded-full text-muted hover:text-fg transition"
                  >
                    {saved ? (
                      <BookmarkCheck className="h-3.5 w-3.5 text-amber-500" />
                    ) : (
                      <Bookmark className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    aria-label="Movie details"
                    title="Movie details"
                    className="p-1 rounded-full text-muted hover:text-fg transition"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </TiltCard>

        {showModal && <MovieTrailerModal item={item} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  // Poster variant (rail & grid)
  return (
    <>
      <TiltCard maxTilt={5} scale={1.02} className="h-full w-full">
        <article className="group relative flex flex-col overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5">
          {/* Poster 2:3 ratio frame */}
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted/20">
            <SafeImage
              src={item.image}
              alt={item.title}
              category="Movies"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle gradient scrim */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 transition-opacity group-hover:opacity-80" />

            {/* Top badges */}
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between z-20 pointer-events-auto">
              {rating ? (
                <span className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-bold text-amber-400 backdrop-blur-md">
                  <Star className="h-3 w-3 fill-current" />
                  {rating}
                </span>
              ) : (
                <span className="rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white/70 backdrop-blur-md">
                  Film
                </span>
              )}
              <button
                type="button"
                aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                title={saved ? "Remove from watchlist" : "Add to watchlist"}
                onClick={handleToggleFavorite}
                onPointerDown={(e) => e.stopPropagation()}
                className="cursor-pointer grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white/80 backdrop-blur-md transition hover:scale-110 hover:bg-black hover:text-amber-400 active:scale-95"
              >
                {saved ? (
                  <BookmarkCheck className="h-4 w-4 text-amber-400" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Center hover play button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="cursor-pointer z-10 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-label={`Play trailer for ${item.title}`}
            >
              <span className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/30 transition hover:scale-105 hover:bg-amber-400">
                <Play className="h-3.5 w-3.5 fill-current" />
                Trailer
              </span>
            </button>

            {/* Bottom badge on poster */}
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10">
              {year && (
                <span className="text-[11px] font-medium text-white/75 drop-shadow">
                  {year} · {item.categories[0] ?? "Cinema"}
                </span>
              )}
            </div>
          </div>

          {/* Card info beneath poster */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <h3
                onClick={() => setShowModal(true)}
                className="line-clamp-1 font-semibold text-fg transition-colors group-hover:text-amber-500 cursor-pointer"
              >
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                {item.description || "Cinema discovery title."}
              </p>
            </div>

            {/* Actions strip */}
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs text-muted">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 font-medium text-amber-500 hover:text-amber-400 transition"
              >
                Details
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="More movies like this"
                  title="More movies like this"
                  onClick={() => handleAdjustTopic(1)}
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Fewer movies like this"
                  title="Fewer movies like this"
                  onClick={() => handleAdjustTopic(-1)}
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Dismiss movie"
                  title="Dismiss movie"
                  onClick={handleDismiss}
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Share movie"
                  title="Share movie"
                  onClick={() => setShareOpen((open) => !open)}
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {shareOpen && (
              <div className="mt-2 rounded-xl border border-border bg-card-strong p-2.5 text-xs space-y-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/25 transition"
                >
                  <Share2 className="h-3 w-3" />
                  Copy Link / Share
                </button>

                <div>
                  <p className="font-semibold text-muted text-[10px] uppercase tracking-wider">
                    Or Share to Together:
                  </p>
                  {groups.length === 0 ? (
                    <p className="mt-1 text-muted text-[11px]">Create a group first.</p>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {groups.map((group) => (
                        <li key={group.id}>
                          <button
                            type="button"
                            className="w-full rounded-md px-2 py-1 text-left text-xs hover:bg-chip transition"
                            onClick={() => {
                              dispatch(shareToGroup({ groupId: group.id, item }));
                              setShareOpen(false);
                              toast.success(`Shared to ${group.name}!`);
                            }}
                          >
                            {group.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      </TiltCard>

      {showModal && <MovieTrailerModal item={item} onClose={() => setShowModal(false)} />}
    </>
  );
}
