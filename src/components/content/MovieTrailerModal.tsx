"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "@/components/ui/Toast";
import { shareContent, shareToPlatform } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { shareToGroup } from "@/store/slices/togetherSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  ExternalLink,
  MessageCircle,
  Play,
  RotateCcw,
  Share2,
  Star,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export function MovieTrailerModal({
  item,
  onClose,
  initialPlay = true,
}: {
  item: ContentItem;
  onClose: () => void;
  initialPlay?: boolean;
}) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((record) => record.id === item.id),
  );
  const groups = useAppSelector((state) => state.together.groups);
  const [isPlaying, setIsPlaying] = useState(initialPlay);
  const [shareOpen, setShareOpen] = useState(false);

  const [trailerKey, setTrailerKey] = useState<string | null>(
    item.metadata.trailerKey ?? null,
  );

  // If trailerKey is not directly attached to item metadata, query the server endpoint
  useEffect(() => {
    if (trailerKey) return;
    let isCancelled = false;

    async function loadTrailer() {
      try {
        const res = await fetch(`/api/movies?trailerId=${encodeURIComponent(item.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.trailerKey) {
            setTrailerKey(data.trailerKey);
          }
        }
      } catch {
        // Fallback search player will be used
      }
    }

    loadTrailer();
    return () => {
      isCancelled = true;
    };
  }, [item.id, trailerKey]);

  // Construct official video embed URL: uses direct YouTube key if available, or official YouTube search embed
  const searchQuery = encodeURIComponent(
    `${item.title} ${item.metadata.year ?? ""} official trailer`,
  );
  const embedSrc = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1&enablejsapi=1`
    : `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1&mute=0&controls=1&rel=0&playsinline=1&enablejsapi=1`;

  const externalTrailerUrl = trailerKey
    ? `https://www.youtube.com/watch?v=${trailerKey}`
    : `https://www.youtube.com/results?search_query=${searchQuery}`;

  const handleToggleWatchlist = () => {
    dispatch(toggleFavorite(item));
    // Synchronize with server-side /api/favorites
    if (typeof window !== "undefined") {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      }).catch(() => {});
    }
    toast.success(saved ? "Removed from cinema watchlist" : "Added to cinema watchlist");
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trailer-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#12141c] text-white shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white/90 backdrop-blur hover:bg-black hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Media Player / Backdrop Hero */}
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            {isPlaying ? (
              <div className="relative h-full w-full bg-black">
                <iframe
                  src={embedSrc}
                  title={`${item.title} Official Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <div className="relative h-full w-full">
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  category="Movies"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="group flex items-center gap-3 rounded-full bg-amber-500 px-6 py-3 font-semibold text-black shadow-lg shadow-amber-500/30 transition hover:scale-105 hover:bg-amber-400"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Play Official Trailer
                  </button>
                  <a
                    href={externalTrailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
                  >
                    Watch on YouTube <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Audio Guidance & Direct YouTube Strip */}
          {isPlaying && (
            <div className="flex items-center justify-between px-5 py-2.5 bg-neutral-900 border-b border-white/10 text-xs flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Volume2 className="h-3.5 w-3.5 shrink-0" />
                <span>Trailer Audio Streaming Live — click video player to adjust volume</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="text-white/60 hover:text-white inline-flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Player
                </button>
                <a
                  href={externalTrailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/80 hover:text-white underline text-[11px]"
                >
                  Open in YouTube <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Movie Details */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
              {item.metadata.year && (
                <span className="rounded-md bg-white/10 px-2 py-0.5 font-medium text-white">
                  {item.metadata.year}
                </span>
              )}
              {item.metadata.rating ? (
                <span className="flex items-center gap-1 font-semibold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {item.metadata.rating.toFixed(1)} TMDB
                </span>
              ) : null}
              {item.metadata.runtime ? (
                <span>{item.metadata.runtime} min</span>
              ) : null}
              <span>· {item.source}</span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider">
                Official Trailer Connected
              </span>
            </div>

            <h2 id="trailer-title" className="editorial mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              {item.title}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {item.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                >
                  #{category}
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/80 font-light">
              {item.description || "No overview available for this title."}
            </p>

            {/* Action Buttons: Add to Watchlist, Real Share, and External Link */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={handleToggleWatchlist}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  saved
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {saved ? <BookmarkCheck className="h-4 w-4 text-amber-400" /> : <Bookmark className="h-4 w-4" />}
                {saved ? "In Watchlist" : "Add to Watchlist"}
              </button>

              <button
                type="button"
                onClick={() => setShareOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                  shareOpen
                    ? "border-amber-500 bg-amber-500/20 text-amber-300"
                    : "border-white/15 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition"
                >
                  View on {item.source} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Real Social Share Drawer */}
            {shareOpen && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                  Share via Social Channels or Copy Link:
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => shareToPlatform(item, "twitter")}
                    className="flex items-center gap-1.5 rounded-full bg-black/60 border border-white/20 hover:border-white/40 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-black"
                  >
                    <span>𝕏 / Twitter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => shareToPlatform(item, "whatsapp")}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600/30 border border-emerald-500/40 hover:bg-emerald-600/50 px-3.5 py-1.5 text-xs font-medium text-emerald-300 transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => shareToPlatform(item, "reddit")}
                    className="flex items-center gap-1.5 rounded-full bg-orange-600/30 border border-orange-500/40 hover:bg-orange-600/50 px-3.5 py-1.5 text-xs font-medium text-orange-300 transition"
                  >
                    <span>Reddit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => shareToPlatform(item, "linkedin")}
                    className="flex items-center gap-1.5 rounded-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/50 px-3.5 py-1.5 text-xs font-medium text-blue-300 transition"
                  >
                    <span>LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await shareContent(item);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </button>
                </div>

                {/* Share to Together discovery circles */}
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                    Or Share to Together Lounge:
                  </p>
                  {groups.length === 0 ? (
                    <p className="mt-1 text-xs text-white/50">Join or create a Together group first.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {groups.map((group) => (
                        <li key={group.id}>
                          <button
                            type="button"
                            className="w-full rounded-xl px-3 py-2 text-left text-xs text-white/90 bg-white/5 hover:bg-white/15 transition flex items-center justify-between"
                            onClick={() => {
                              dispatch(shareToGroup({ groupId: group.id, item }));
                              setShareOpen(false);
                              toast.success(`Shared to ${group.name}!`);
                            }}
                          >
                            <span>{group.name}</span>
                            <span className="text-[10px] text-white/50">{group.members.length} members</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
