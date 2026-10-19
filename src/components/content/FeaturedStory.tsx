"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { formatRelativeTime } from "@/lib/format";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { recordOpen } from "@/store/slices/preferencesSlice";
import { Bookmark, BookmarkCheck, ExternalLink, Film, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { MovieTrailerModal } from "./MovieTrailerModal";

export function FeaturedStory({ item }: { item: ContentItem }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((record) => record.id === item.id),
  );
  const [showTrailer, setShowTrailer] = useState(false);

  const isMovie = item.type === "movie";

  const handleOpen = () => {
    dispatch(recordOpen(item.id));
    if (isMovie) {
      setShowTrailer(true);
    } else if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <article className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--theme-accent)]/20 bg-gradient-to-br from-[#11131b] via-[#161824] to-[#1a1528] text-paper shadow-2xl transition duration-500 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_25px_60px_-15px_var(--theme-accent-glow)]">
        {/* Ambient background glow matching theme */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--theme-accent)" }}
        />

        <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
          <div className="relative z-10 flex flex-col justify-between p-8 sm:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-slate">
                <span className="flex items-center gap-1.5 font-bold text-[var(--theme-accent)]">
                  {isMovie ? <Film className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {isMovie ? "CINEMATIC SPOTLIGHT" : "FEATURED DISCOVERY"}
                </span>
                <span>·</span>
                <span>{item.source}</span>
                {item.provenance === "mock" && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">Sample</span>
                )}
              </div>

              <h2
                onClick={handleOpen}
                className="editorial mt-4 max-w-xl cursor-pointer text-3xl font-bold leading-[1.12] tracking-tight text-white transition-colors group-hover:text-[var(--theme-accent)] sm:text-5xl"
              >
                {item.title}
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate/90 sm:text-base">
                {item.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {item.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate"
                  >
                    #{cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={handleOpen}
                className="flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:brightness-110"
              >
                {isMovie ? (
                  <>
                    <Play className="h-4 w-4 fill-current" /> Play Trailer
                  </>
                ) : (
                  <>
                    Read Story <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/15"
                onClick={() => dispatch(toggleFavorite(item))}
              >
                {saved ? <BookmarkCheck className="h-4 w-4 text-[var(--theme-accent)]" /> : <Bookmark className="h-4 w-4" />}
                {saved ? "Saved in Favorites" : "Save for later"}
              </button>

              <span className="text-xs text-slate">{formatRelativeTime(item.publishedAt)}</span>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden lg:min-h-full">
            <SafeImage
              src={item.image}
              alt={item.title}
              category={item.categories[0]}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11131b] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#11131b] lg:via-transparent lg:to-transparent" />
          </div>
        </div>
      </article>

      {showTrailer && isMovie && (
        <MovieTrailerModal item={item} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
}
