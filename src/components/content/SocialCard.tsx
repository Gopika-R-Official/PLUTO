"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import { shareContent } from "@/lib/share";
import type { ContentItem, Interest } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import {
  adjustTopic,
  dismissItem,
  toggleFollowTopic,
} from "@/store/slices/preferencesSlice";
import { shareToGroup } from "@/store/slices/togetherSlice";
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageSquare,
  Minus,
  Plus,
  Send,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export function SocialCard({ item }: { item: ContentItem }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.favorites.items.some((record) => record.id === item.id),
  );
  const groups = useAppSelector((state) => state.together.groups);
  const followed = useAppSelector((state) => state.preferences.followedTopics);

  const [likes, setLikes] = useState(item.metadata.likes ?? 18);
  const [hasLiked, setHasLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentsList, setCommentsList] = useState<Comment[]>([
    {
      id: "c1",
      author: "Priya S.",
      text: "Really insightful perspective on the craft here.",
      time: "2h ago",
    },
    {
      id: "c2",
      author: "Aditya R.",
      text: "Bookmarked this for our team study session.",
      time: "45m ago",
    },
  ]);

  const author = item.metadata.author ?? "Community Voice";
  const handle = item.metadata.handle ?? `@${author.toLowerCase().replace(/\s+/g, "")}`;
  const primaryCategory = item.categories[0] as Interest | undefined;

  const handleLike = () => {
    setHasLiked((prev) => {
      const next = !prev;
      setLikes((curr) => (next ? curr + 1 : curr - 1));
      toast.success(next ? "Liked post" : "Unliked post");
      return next;
    });
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
    toast.success(saved ? "Removed bookmark" : "Bookmarked post");
  };

  const handleShare = async () => {
    await shareContent(item);
  };

  const handleToggleFollow = (category: Interest) => {
    dispatch(toggleFollowTopic(category));
    const isNowFollowed = !followed.includes(category);
    toast.success(isNowFollowed ? `Now following #${category}` : `Unfollowed #${category}`);
  };

  const handleAdjustTopic = (delta: 1 | -1) => {
    if (!primaryCategory) return;
    dispatch(adjustTopic({ topic: primaryCategory, delta }));
    toast.info(delta > 0 ? `Showing more #${primaryCategory}` : `Showing fewer #${primaryCategory}`);
  };

  const handleDismiss = () => {
    dispatch(dismissItem(item.id));
    toast.info("Post hidden from feed");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: "You",
      text: commentInput.trim(),
      time: "Just now",
    };
    setCommentsList((prev) => [newComment, ...prev]);
    setCommentInput("");
    toast.success("Comment posted!");
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-lg">
      <div>
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-tr from-[var(--theme-accent)] to-purple-400 font-bold text-white shadow-sm">
              {author.slice(0, 2).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-fg">{author}</span>
                <span className="text-xs text-muted">{handle}</span>
              </div>
              <span className="text-[11px] text-muted">
                {formatRelativeTime(item.publishedAt)} · {item.source}
              </span>
            </div>
          </div>

          <span className="flex items-center gap-1 rounded-full bg-chip px-2.5 py-0.5 text-[11px] font-medium text-muted">
            <Sparkles className="h-3 w-3 text-[var(--theme-accent)]" /> Post
          </span>
        </div>

        {/* Post Text */}
        <p className="mt-4 text-sm leading-relaxed text-fg/90">
          {item.description}
        </p>

        {/* Visual Media Attachment */}
        <div className="mt-3.5 overflow-hidden rounded-2xl border border-border/80">
          <SafeImage
            src={item.image}
            alt={item.title}
            category={primaryCategory}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Category Hashtags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleToggleFollow(category as Interest)}
              className="rounded-full bg-chip px-2.5 py-0.5 text-xs text-muted transition hover:bg-[var(--theme-accent-muted)] hover:text-fg"
            >
              #{category}
              {followed.includes(category as Interest) ? " · following" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Social Interactions Bar */}
      <div className="mt-5 border-t border-border/70 pt-3">
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 font-medium transition ${
                hasLiked ? "text-rose-500" : "hover:text-rose-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
              <span>{likes}</span>
            </button>

            <button
              type="button"
              onClick={() => setCommentsOpen((prev) => !prev)}
              aria-label="View comments"
              className={`flex items-center gap-1.5 transition ${
                commentsOpen ? "text-[var(--theme-accent)] font-semibold" : "text-muted hover:text-fg"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{commentsList.length}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={saved ? "Remove bookmark" : "Bookmark post"}
              title={saved ? "Remove bookmark" : "Bookmark post"}
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
              aria-label="More posts like this"
              title="More posts like this"
              onClick={() => handleAdjustTopic(1)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Fewer posts like this"
              title="Fewer posts like this"
              onClick={() => handleAdjustTopic(-1)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Dismiss post"
              title="Dismiss post"
              onClick={handleDismiss}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Share post"
              title="Share post"
              onClick={() => setShareOpen((open) => !open)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-chip hover:text-fg transition"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Expandable Comments Drawer */}
        {commentsOpen && (
          <div className="mt-3.5 rounded-2xl border border-border bg-card-strong p-3.5 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-semibold text-fg text-xs">Comments ({commentsList.length})</span>
              <button
                type="button"
                onClick={() => setCommentsOpen(false)}
                className="text-muted hover:text-fg"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2.5 divide-y divide-border/40">
              {commentsList.map((c) => (
                <div key={c.id} className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-medium text-fg">
                    <span>{c.author}</span>
                    <span className="text-[10px] text-muted">{c.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-border/60">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-fg focus:outline-none focus:border-[var(--theme-accent)]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="flex items-center gap-1 rounded-xl bg-[var(--theme-accent)] px-3 py-1.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Post</span>
                <Send className="h-3 w-3" />
              </button>
            </form>
          </div>
        )}

        {/* Share Options Drawer */}
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
                <p className="mt-1 text-muted text-[11px]">Create a group first.</p>
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
