"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { TiltCard } from "@/components/ui/TiltCard";
import { toast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import { shareContent } from "@/lib/share";
import type { ContentItem, Interest } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import {
  adjustTopic,
  dismissItem,
  recordOpen,
  toggleFollowTopic,
} from "@/store/slices/preferencesSlice";
import { shareToGroup } from "@/store/slices/togetherSlice";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Minus,
  Newspaper,
  Plus,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";

export function NewsCard({
  item,
  variant = "editorial",
}: {
  item: ContentItem;
  variant?: "editorial" | "lead" | "compact";
}) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((record) => record.id === item.id),
  );
  const groups = useAppSelector((state) => state.together.groups);
  const followed = useAppSelector((state) => state.preferences.followedTopics);
  const [shareOpen, setShareOpen] = useState(false);

  const openArticle = () => {
    dispatch(recordOpen(item.id));
    if (item.url && item.url.startsWith("http")) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      toast.info("Original publisher link is currently unavailable for this briefing.");
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
    toast.success(saved ? "Removed from saved stories" : "Saved story for later");
  };

  const handleShare = async () => {
    await shareContent(item);
  };

  const handleToggleFollow = (topic: Interest) => {
    dispatch(toggleFollowTopic(topic));
    const isNowFollowed = !followed.includes(topic);
    toast.success(isNowFollowed ? `Now following #${topic}` : `Unfollowed #${topic}`);
  };

  const handleAdjustTopic = (delta: 1 | -1) => {
    if (!primaryCategory) return;
    dispatch(adjustTopic({ topic: primaryCategory, delta }));
    toast.info(delta > 0 ? `Showing more #${primaryCategory}` : `Showing fewer #${primaryCategory}`);
  };

  const handleDismiss = () => {
    dispatch(dismissItem(item.id));
    toast.info("Story hidden from feed");
  };

  const primaryCategory = item.categories[0] as Interest | undefined;

  // Lead / Hero Article Variant
  if (variant === "lead") {
    return (
      <TiltCard maxTilt={3} scale={1.01} className="h-full w-full">
        <article className="group relative overflow-hidden rounded-[2.2rem] border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-2xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between p-6 sm:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <span className="flex items-center gap-1 font-semibold text-[var(--theme-accent)]">
                    <Newspaper className="h-3.5 w-3.5" /> {item.source}
                  </span>
                  <span>·</span>
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                  {item.provenance === "mock" && (
                    <span className="rounded-full bg-chip px-2 py-0.5 text-[10px]">Sample</span>
                  )}
                </div>

                <h2
                  onClick={openArticle}
                  className="editorial mt-3 cursor-pointer text-2xl font-bold leading-tight tracking-tight text-fg transition-colors group-hover:text-[var(--theme-accent)] sm:text-4xl"
                >
                  {item.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted sm:text-base">
                  {item.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleToggleFollow(category as Interest)}
                      className="rounded-full bg-chip px-3 py-1 text-xs text-muted transition hover:bg-[var(--theme-accent-muted)] hover:text-fg"
                    >
                      #{category}
                      {followed.includes(category as Interest) ? " · following" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={openArticle}
                  className="flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105"
                >
                  Read Article
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:bg-chip transition"
                >
                  {saved ? (
                    <BookmarkCheck className="h-4 w-4 text-[var(--theme-accent)]" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {saved ? "Saved" : "Save for later"}
                </button>

                <button
                  type="button"
                  aria-label="Share article"
                  onClick={() => setShareOpen((prev) => !prev)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted hover:bg-chip hover:text-fg transition"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative min-h-[260px] overflow-hidden lg:min-h-full">
              <SafeImage
                src={item.image}
                alt={item.title}
                category={primaryCategory}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent lg:hidden" />
            </div>
          </div>

          {shareOpen && (
            <div className="border-t border-border bg-card-strong p-4 space-y-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-accent)] px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
              >
                <Share2 className="h-3.5 w-3.5" />
                Copy Link / Native Share
              </button>

              <div className="pt-1">
                <p className="text-xs uppercase tracking-wider text-muted font-semibold">Share with Group:</p>
                {groups.length === 0 ? (
                  <p className="mt-1 text-sm text-muted">Create a Together group first.</p>
                ) : (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {groups.map((group) => (
                      <li key={group.id}>
                        <button
                          type="button"
                          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-chip transition"
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
        </article>
      </TiltCard>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group relative flex gap-3.5 p-3.5 rounded-2xl border border-border bg-card shadow-xs hover:shadow-md transition">
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase">
              <span className="flex items-center gap-1 font-semibold text-[var(--theme-accent)]">
                <Newspaper className="h-3 w-3" />
                <span>{item.source}</span>
              </span>
              <span>{formatRelativeTime(item.publishedAt)}</span>
            </div>

            <h4
              onClick={openArticle}
              className="font-serif text-sm font-semibold text-fg mt-1 cursor-pointer hover:text-[var(--theme-accent)] leading-snug line-clamp-2 transition"
            >
              {item.title}
            </h4>

            <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50 text-xs">
            <button
              type="button"
              onClick={openArticle}
              className="inline-flex items-center gap-1 font-medium text-[var(--theme-accent)] hover:underline"
            >
              <span>Read Brief</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-label={saved ? "Remove from saved" : "Save article"}
                className="p-1 rounded-full text-muted hover:text-fg transition"
              >
                {saved ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share article link"
                title="Share article link"
                className="p-1 rounded-full text-muted hover:text-fg transition"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Editorial Card
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:shadow-xl">
      <div>
        {/* Article header image */}
        <div className="relative h-48 w-full overflow-hidden bg-muted/20">
          <SafeImage
            src={item.image}
            alt={item.title}
            category={primaryCategory}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <span className="rounded-full bg-black/60 px-2.5 py-0.5 font-medium backdrop-blur">
              {item.source}
            </span>
            <span className="text-[11px] text-white/80 drop-shadow">
              {formatRelativeTime(item.publishedAt)}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {item.categories.slice(0, 2).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleToggleFollow(category as Interest)}
                className="rounded-full bg-chip px-2.5 py-0.5 text-[11px] font-medium hover:bg-[var(--theme-accent-muted)] hover:text-fg transition"
              >
                #{category}
                {followed.includes(category as Interest) ? " · following" : ""}
              </button>
            ))}
          </div>

          <h3
            onClick={openArticle}
            className="editorial mt-2.5 cursor-pointer text-xl font-bold leading-snug tracking-tight text-fg transition-colors group-hover:text-[var(--theme-accent)]"
          >
            {item.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs">
          <button
            type="button"
            onClick={openArticle}
            className="flex items-center gap-1 font-semibold text-[var(--theme-accent)] hover:underline"
          >
            Read <ExternalLink className="h-3 w-3" />
          </button>

          <div className="flex items-center gap-1 text-muted">
            <button
              type="button"
              aria-label={saved ? "Remove from saved" : "Save article"}
              title={saved ? "Remove from saved" : "Save article"}
              onClick={handleToggleFavorite}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4 text-[var(--theme-accent)]" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              aria-label="More like this"
              title="More like this"
              onClick={() => handleAdjustTopic(1)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Fewer like this"
              title="Fewer like this"
              onClick={() => handleAdjustTopic(-1)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Dismiss article"
              title="Dismiss article"
              onClick={handleDismiss}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Share article"
              title="Share article"
              onClick={() => setShareOpen((open) => !open)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {shareOpen && (
          <div className="mt-3 rounded-xl border border-border bg-card-strong p-3 text-xs space-y-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/30 px-3 py-1.5 text-xs font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/25 transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              Copy Link / Native Share
            </button>

            <div>
              <p className="font-semibold text-muted text-[10px] uppercase tracking-wider">
                Or Share to Together:
              </p>
              {groups.length === 0 ? (
                <p className="mt-1 text-muted">Create a group first.</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <button
                        type="button"
                        className="w-full rounded-md px-2 py-1 text-left hover:bg-chip transition"
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
  );
}
