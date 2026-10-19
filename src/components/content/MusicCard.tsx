"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { TiltCard } from "@/components/ui/TiltCard";
import { toast } from "@/components/ui/Toast";
import { audioEngine } from "@/lib/audioEngine";
import { shareContent } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { shareToGroup } from "@/store/slices/togetherSlice";
import {
  Bookmark,
  BookmarkCheck,
  Disc3,
  ExternalLink,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";

export function MusicCard({ item }: { item: ContentItem }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((record) => record.id === item.id),
  );
  const groups = useAppSelector((state) => state.together.groups);
  const [isPlaying, setIsPlaying] = useState(audioEngine.isPlaying(item.id));
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    return audioEngine.subscribe((playingId) => {
      setIsPlaying(playingId === item.id);
    });
  }, [item.id]);

  const artist = item.metadata.artist ?? item.source;
  const album = item.metadata.album;
  const duration = item.metadata.duration ?? "3:42";
  const hasPreview = Boolean(item.metadata.audioPreview);

  // External streaming destination
  const searchUrl =
    item.url ||
    `https://open.spotify.com/search/${encodeURIComponent(`${item.title} ${artist}`)}`;

  const togglePlayback = async () => {
    if (!hasPreview) {
      toast.info("Audio preview is unavailable for this track.");
      return;
    }

    if (isPlaying) {
      audioEngine.stop();
    } else {
      const started = await audioEngine.play(item.id, item.metadata.audioPreview);
      if (!started) {
        toast.error("Could not play audio preview.");
      }
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(item));
    if (typeof window !== "undefined") {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      }).catch(() => {});
    }
    toast.success(saved ? "Removed from vinyl shelf" : "Added to vinyl shelf");
  };

  const handleShare = async () => {
    await shareContent(item);
  };

  return (
    <TiltCard maxTilt={5} scale={1.02} className="h-full w-full">
      <article className="group relative flex flex-col overflow-hidden rounded-[1.8rem] border border-pink-500/15 bg-gradient-to-b from-card to-card-strong p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10">
        {/* Square Vinyl / Album Art Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black shadow-md">
          <SafeImage
            src={item.image}
            alt={item.title}
            category="Music"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              isPlaying ? "scale-105" : ""
            }`}
          />

          {/* Ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Vinyl record disc peeking on hover/play */}
          <div
            className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border-4 border-white/20 bg-black/90 opacity-40 transition-all duration-500 group-hover:opacity-75 ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "6s" }}
          >
            <div className="absolute inset-3 rounded-full border border-white/10" />
            <div className="absolute inset-7 rounded-full border border-white/10" />
            <div className="absolute inset-10 rounded-full bg-pink-500/40" />
          </div>

          {/* Play / Pause Floating Trigger */}
          <div className="absolute inset-0 flex items-center justify-center">
            {hasPreview ? (
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause track preview" : "Play track preview"}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/40 transition hover:scale-110 hover:bg-pink-400"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="ml-1 h-6 w-6 fill-current" />
                )}
              </button>
            ) : (
              <div
                title="Audio preview unavailable"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white/40 border border-white/15 backdrop-blur cursor-not-allowed"
              >
                <VolumeX className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Top Badges */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-pink-300 backdrop-blur">
              <Disc3 className="h-3 w-3" />
              {item.categories[0] ?? "Audio"}
            </span>

            {isPlaying ? (
              <span className="flex items-center gap-1 rounded-full bg-pink-500/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                <Volume2 className="h-3 w-3 animate-pulse" /> PREVIEWING
              </span>
            ) : !hasPreview ? (
              <span className="rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60 backdrop-blur">
                No Preview
              </span>
            ) : null}
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-3 right-3">
            <span className="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white/80 backdrop-blur">
              {duration}
            </span>
          </div>
        </div>

        {/* Metadata & Controls */}
        <div className="mt-3.5 flex flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-1 font-bold text-fg transition-colors group-hover:text-pink-500">
              {item.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-muted">
              {artist} {album ? `· ${album}` : ""}
            </p>

            {/* Soundwave Simulation Animation strictly when playing real audio */}
            {isPlaying && (
              <div className="mt-2.5 flex items-end gap-1 h-3" aria-label="Audio visualizer">
                {[40, 80, 55, 95, 30, 70, 90, 45, 85, 60, 100, 35].map((height, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-pink-500 animate-pulse"
                    style={{
                      height: `${height}%`,
                      animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Card Actions */}
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-medium text-pink-500 hover:text-pink-400 transition"
            >
              Listen <ExternalLink className="h-3 w-3" />
            </a>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={saved ? "Remove favorite" : "Favorite track"}
                title={saved ? "Remove favorite" : "Favorite track"}
                onClick={handleToggleFavorite}
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-chip hover:text-pink-500 transition"
              >
                {saved ? (
                  <BookmarkCheck className="h-4 w-4 text-pink-500" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                aria-label="Share track"
                title="Share track"
                onClick={() => setShareOpen((open) => !open)}
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-chip hover:text-fg transition"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Share Options Drawer */}
          {shareOpen && (
            <div className="mt-2 rounded-xl border border-border bg-card-strong p-3 text-xs space-y-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-pink-500/15 border border-pink-500/30 px-3 py-1.5 text-xs font-semibold text-pink-400 hover:bg-pink-500/25 transition"
              >
                <Share2 className="h-3.5 w-3.5" />
                Copy Link / Native Share
              </button>

              <div>
                <p className="font-semibold text-muted text-[10px] uppercase tracking-wider">
                  Or share to a Circle:
                </p>
                {groups.length === 0 ? (
                  <p className="mt-1 text-muted text-[11px]">Join or create a Together group first.</p>
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
  );
}
