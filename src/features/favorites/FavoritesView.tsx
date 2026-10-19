"use client";

import { ActivityCard } from "@/components/content/ActivityCard";
import { ContentCard } from "@/components/content/ContentCard";
import { MovieCard } from "@/components/content/MovieCard";
import { MusicCard } from "@/components/content/MusicCard";
import { NewsCard } from "@/components/content/NewsCard";
import { RestaurantCard } from "@/components/content/RestaurantCard";
import { SocialCard } from "@/components/content/SocialCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import type { ContentType } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFavoritesOrder } from "@/store/slices/favoritesSlice";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Archive } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const TYPES: Array<{ id: ContentType | "all"; label: string }> = [
  { id: "all", label: "Entire Archive" },
  { id: "movie", label: "Cinema Watchlist" },
  { id: "news", label: "Longform News" },
  { id: "music", label: "Vinyl Shelf" },
  { id: "social", label: "Community Voices" },
  { id: "activity", label: "Outings & Places" },
  { id: "restaurant", label: "Culinary & Dining" },
];

function SortableFavoriteCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 50 : undefined,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative ${
        isDragging
          ? "opacity-60 scale-[1.02] shadow-2xl ring-2 ring-blue-500/30 rounded-3xl"
          : ""
      }`}
    >
      {children}
    </div>
  );
}

export function FavoritesView() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.favorites.items);
  const [filter, setFilter] = useState<ContentType | "all">("all");

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const record of items) {
      const typeKey = record.item.type === "place" ? "activity" : record.item.type;
      map[typeKey] = (map[typeKey] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((record) => {
        if (filter === "all") return true;
        if (filter === "activity") return record.item.type === "activity" || record.item.type === "place";
        return record.item.type === filter;
      }),
    [items, filter],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((r) => r.id === active.id);
    const newIndex = items.findIndex((r) => r.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      dispatch(setFavoritesOrder(newItems));
      toast.success("Favorites order updated");
    }
  };

  const sortableIds = useMemo(() => filtered.map((r) => r.id), [filtered]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 animate-fadeIn">
      {/* Editorial Archive Header */}
      <header className="relative overflow-hidden rounded-[2.5rem] border border-black/[0.08] dark:border-white/10 bg-white/70 dark:bg-[#0c101d]/85 backdrop-blur-xl p-8 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-amber-400" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-blue-500" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-amber-500">
                <Archive className="h-3.5 w-3.5" />
                THE PRIVATE ARCHIVE · LOCAL COLLECTION
              </span>
              <span className="font-mono text-xs text-neutral-400">
                {items.length} artifacts preserved
              </span>
            </div>

            <h1 className="editorial mt-3 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
              Kept for posterity
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-base">
              Your privately curated repository stored securely in your browser cache.
              Drag items to reorder your canon. Changes persist automatically.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] p-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {(counts.movie ?? 0)} films · {(counts.news ?? 0)} reads · {(counts.music ?? 0)} records
              {(counts.restaurant ?? 0) > 0 && ` · ${counts.restaurant} dining`}
            </span>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((type) => {
          const count = counts[type.id] ?? 0;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setFilter(type.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                filter === type.id
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                  : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {type.label}
              {count > 0 && <span className="ml-1.5 opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Content Grid with DndContext */}
      {filtered.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "Your archive is currently empty" : `No saved ${filter} items`}
          body="Bookmark a film, journalism dispatch, or vinyl track from Discover or Trending to assemble your personal collection."
          action={
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-xs font-semibold shadow-md transition hover:scale-[1.02]"
            >
              Explore Discover
              <span>→</span>
            </Link>
          }
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
            {filter === "movie" ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                  <h2 className="editorial text-2xl font-bold text-neutral-900 dark:text-white">Cinema Watchlist</h2>
                  <span className="text-xs text-neutral-400 font-mono">{filtered.length} films ready</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((record) => (
                    <SortableFavoriteCard key={record.id} id={record.id}>
                      <MovieCard item={record.item} variant="poster" />
                    </SortableFavoriteCard>
                  ))}
                </div>
              </section>
            ) : filter === "music" ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                  <h2 className="editorial text-2xl font-bold text-neutral-900 dark:text-white">Vinyl Soundstage Shelf</h2>
                  <span className="text-xs text-neutral-400 font-mono">{filtered.length} records preserved</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((record) => (
                    <SortableFavoriteCard key={record.id} id={record.id}>
                      <MusicCard item={record.item} />
                    </SortableFavoriteCard>
                  ))}
                </div>
              </section>
            ) : filter === "news" ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                  <h2 className="editorial text-2xl font-bold text-neutral-900 dark:text-white">Curated Journalism & Briefs</h2>
                  <span className="text-xs text-neutral-400 font-mono">{filtered.length} articles saved</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {filtered.map((record) => (
                    <SortableFavoriteCard key={record.id} id={record.id}>
                      <NewsCard item={record.item} variant="editorial" />
                    </SortableFavoriteCard>
                  ))}
                </div>
              </section>
            ) : filter === "social" ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                  <h2 className="editorial text-2xl font-bold text-neutral-900 dark:text-white">Saved Discussions</h2>
                  <span className="text-xs text-neutral-400 font-mono">{filtered.length} voices</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {filtered.map((record) => (
                    <SortableFavoriteCard key={record.id} id={record.id}>
                      <SocialCard item={record.item} />
                    </SortableFavoriteCard>
                  ))}
                </div>
              </section>
            ) : filter === "activity" ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                  <h2 className="editorial text-2xl font-bold text-neutral-900 dark:text-white">Outings & Experiences</h2>
                  <span className="text-xs text-neutral-400 font-mono">{filtered.length} experiences planned</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((record) => (
                    <SortableFavoriteCard key={record.id} id={record.id}>
                      <ActivityCard item={record.item} />
                    </SortableFavoriteCard>
                  ))}
                </div>
              </section>
            ) : filter === "restaurant" ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                  <h2 className="editorial text-2xl font-bold text-neutral-900 dark:text-white">Culinary & Dining Guide</h2>
                  <span className="text-xs text-neutral-400 font-mono">{filtered.length} dining spots bookmarked</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((record) => (
                    <SortableFavoriteCard key={record.id} id={record.id}>
                      <RestaurantCard item={record.item} />
                    </SortableFavoriteCard>
                  ))}
                </div>
              </section>
            ) : (
              /* Entire Archive: Polymorphic Grid */
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((record) => (
                  <SortableFavoriteCard key={record.id} id={record.id}>
                    <ContentCard item={record.item} />
                  </SortableFavoriteCard>
                ))}
              </div>
            )}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
