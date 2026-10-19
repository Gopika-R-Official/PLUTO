"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { shareToGroup } from "@/store/slices/togetherSlice";
import { Bookmark, BookmarkCheck, Calendar, ExternalLink, MapPin, Share2, Tag } from "lucide-react";
import { useState } from "react";

export function ActivityCard({ item }: { item: ContentItem }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((record) => record.id === item.id),
  );
  const groups = useAppSelector((state) => state.together.groups);
  const [shareOpen, setShareOpen] = useState(false);

  const location = item.metadata.locationLabel ?? "Local Venue";
  const cost = item.metadata.cost ?? "flexible";
  const costBadge =
    cost === "free" ? "Free" : cost === "budget" ? "$" : "$$";

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5">
      <div>
        {/* Activity Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-muted/20">
          <SafeImage
            src={item.image}
            alt={item.title}
            category={item.categories[0] || "Lifestyle"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Top badges */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-semibold text-black backdrop-blur">
              <Tag className="h-3 w-3" />
              {costBadge}
            </span>

            <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] text-white/80 backdrop-blur">
              Sample activity
            </span>
          </div>

          {/* Bottom location badge on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs font-medium text-white">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span className="drop-shadow">{location}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="flex items-center gap-1 rounded-full bg-chip px-2.5 py-0.5 text-[11px]">
              <Calendar className="h-3 w-3 text-emerald-500" />
              This week
            </span>
            <span>·</span>
            <span>{item.categories[0] ?? "Outing"}</span>
          </div>

          <h3 className="editorial mt-2.5 text-xl font-bold leading-snug tracking-tight text-fg transition-colors group-hover:text-emerald-500">
            {item.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
            {item.description}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              Explore <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-muted">Sample experience</span>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={saved ? "Remove favorite" : "Save activity"}
              title={saved ? "Remove favorite" : "Save activity"}
              onClick={() => dispatch(toggleFavorite(item))}
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-chip hover:text-emerald-500"
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4 text-emerald-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              aria-label="Share activity"
              title="Share activity"
              onClick={() => setShareOpen((open) => !open)}
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-chip hover:text-fg"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {shareOpen && (
          <div className="mt-3 rounded-xl border border-border bg-card-strong p-3 text-xs">
            <p className="font-semibold text-muted">Share to Together:</p>
            {groups.length === 0 ? (
              <p className="mt-1 text-muted">Create a group first.</p>
            ) : (
              <ul className="mt-1 space-y-1">
                {groups.map((group) => (
                  <li key={group.id}>
                    <button
                      type="button"
                      className="w-full rounded-md px-2 py-1 text-left hover:bg-chip"
                      onClick={() => {
                        dispatch(shareToGroup({ groupId: group.id, item }));
                        setShareOpen(false);
                      }}
                    >
                      {group.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
