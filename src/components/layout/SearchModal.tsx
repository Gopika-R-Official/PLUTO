"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { debounce } from "@/lib/debounce";
import { MOCK_MUSIC } from "@/lib/mock/music";
import { MOCK_RESTAURANTS } from "@/lib/mock/restaurants";
import type { ContentItem } from "@/lib/types";
import { useGetMoviesQuery, useGetNewsQuery } from "@/store/api/contentApi";
import { Film, MapPin, MessageSquare, Music, Newspaper, Search, Sparkles, Utensils, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<"all" | "news" | "movie" | "dining" | "music">("all");

  useEffect(() => {
    const fn = (val: string) => setDebouncedQuery(val);
    const debounced = debounce(fn, 250);
    debounced(query);
    return () => debounced.cancel();
  }, [query]);

  const newsQuery = useGetNewsQuery({ q: debouncedQuery }, { skip: debouncedQuery.trim().length < 2 });
  const moviesQuery = useGetMoviesQuery({ q: debouncedQuery }, { skip: debouncedQuery.trim().length < 2 });

  const handleClose = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isOpen]);

  const results: ContentItem[] = useMemo(() => {
    if (query.trim().length < 2) return [];
    const qLower = query.toLowerCase();

    const n = (newsQuery.data?.items ?? []).map((item) => ({ ...item, type: "news" as const }));
    const m = (moviesQuery.data?.items ?? []).map((item) => ({ ...item, type: "movie" as const }));
    const r = MOCK_RESTAURANTS.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.description.toLowerCase().includes(qLower) ||
        (item.metadata.cuisine && item.metadata.cuisine.toLowerCase().includes(qLower)) ||
        (item.metadata.locationLabel && item.metadata.locationLabel.toLowerCase().includes(qLower))
    );
    const mu = MOCK_MUSIC.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.description.toLowerCase().includes(qLower) ||
        (item.metadata.artist && item.metadata.artist.toLowerCase().includes(qLower))
    );

    if (category === "news") return n.slice(0, 8);
    if (category === "movie") return m.slice(0, 8);
    if (category === "dining") return r.slice(0, 8);
    if (category === "music") return mu.slice(0, 8);

    return [...n.slice(0, 3), ...m.slice(0, 3), ...r.slice(0, 2), ...mu.slice(0, 2)];
  }, [category, moviesQuery.data, newsQuery.data, query]);

  if (!isOpen) return null;

  const handleSelect = (item: ContentItem) => {
    handleClose();
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/search?q=${encodeURIComponent(item.title)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3.5 border-b border-black/5 dark:border-white/10">
          <Search className="h-5 w-5 text-neutral-400 shrink-0 mr-3" />
          <label htmlFor={searchId} id="search-modal-title" className="sr-only">
            Search intelligence, films, and music
          </label>
          <input
            ref={inputRef}
            id={searchId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dispatches, cinema, topics (e.g. Anthropic, Dune, Ambient)..."
            className="w-full bg-transparent text-base sm:text-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
            ESC
          </kbd>
        </form>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50/70 dark:bg-neutral-950/40 border-b border-black/5 dark:border-white/5 text-xs overflow-x-auto no-scrollbar">
          <span className="text-neutral-400 font-mono uppercase tracking-wider text-[10px]">Filter:</span>
          {(["all", "news", "movie", "dining", "music"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                category === cat
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              {cat === "all"
                ? "All Domains"
                : cat === "news"
                ? "Dispatches"
                : cat === "movie"
                ? "Cinema"
                : cat === "dining"
                ? "Dining"
                : "Vinyl"}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <div className="py-12 text-center">
              <Sparkles className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Explore the discovery universe
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                Type keywords to reveal real-time intelligence, cinema, and cultural dispatches.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No direct matches found for &ldquo;{query}&rdquo;. Press Enter to explore global wire.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition text-left group"
                >
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      category={
                        item.type === "movie"
                          ? "Movies"
                          : item.type === "music"
                          ? "Music"
                          : item.type === "restaurant"
                          ? "Travel"
                          : "Technology"
                      }
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                      {item.type === "movie" ? (
                        <Film className="h-3 w-3 text-amber-500" />
                      ) : item.type === "music" ? (
                        <Music className="h-3 w-3 text-violet-500" />
                      ) : item.type === "restaurant" ? (
                        <Utensils className="h-3 w-3 text-emerald-500" />
                      ) : item.type === "social" ? (
                        <MessageSquare className="h-3 w-3 text-cyan-500" />
                      ) : item.type === "activity" || item.type === "place" ? (
                        <MapPin className="h-3 w-3 text-teal-500" />
                      ) : (
                        <Newspaper className="h-3 w-3 text-blue-500" />
                      )}
                      <span>{item.source}</span>
                      {item.metadata.year && <span>• {item.metadata.year}</span>}
                      {item.metadata.cuisine && <span>• {item.metadata.cuisine}</span>}
                      {item.metadata.artist && <span>• {item.metadata.artist}</span>}
                      {item.metadata.locationLabel && <span>• {item.metadata.locationLabel}</span>}
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
