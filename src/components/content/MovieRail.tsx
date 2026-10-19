"use client";

import { ProvenanceNote } from "@/components/ui/ProvenanceNote";
import type { ContentItem } from "@/lib/types";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { MovieCard } from "./MovieCard";

export function MovieRail({
  title = "Cinematic Radar",
  subtitle = "Festival debuts, 70mm box office, and director retrospectives.",
  movies,
  provenance,
  message,
}: {
  title?: string;
  subtitle?: string;
  movies: ContentItem[];
  provenance?: "live" | "mock";
  message?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    if (scrollRef.current) {
      const distance = 320 * direction;
      scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
              <Film className="h-4 w-4" />
            </span>
            <h2 className="editorial text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {title}
            </h2>
          </div>
          {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {provenance && <ProvenanceNote provenance={provenance} message={message} />}
          <Link
            href="/trending"
            className="text-xs font-semibold text-amber-500 hover:text-amber-400"
          >
            All Films →
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted transition hover:bg-chip hover:text-fg"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted transition hover:bg-chip hover:text-fg"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Snap Rail */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[200px] shrink-0 sm:w-[220px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <MovieCard item={movie} variant="poster" />
          </div>
        ))}
      </div>
    </div>
  );
}
