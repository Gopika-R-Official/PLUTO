"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { YOU } from "@/lib/constants";
import { getCategoryFallbackImage } from "@/lib/images";
import type { DiscoveryGroup, SharedGroupItem } from "@/lib/types";
import { useAppDispatch } from "@/store/hooks";
import { voteShared } from "@/store/slices/togetherSlice";
import { toast } from "@/components/ui/Toast";
import Link from "next/link";
import { useState } from "react";
import { ContentCard } from "./ContentCard";

export function scoreVotes(votes: Record<string, number>): number {
  return Object.values(votes).reduce((sum, v) => sum + v, 0);
}

export function TogetherGroupCard({
  group,
  onCopyInvite,
  isCopied,
}: {
  group: DiscoveryGroup;
  onCopyInvite?: (code: string) => void;
  isCopied?: boolean;
}) {
  const statusConfig = {
    planning: {
      label: "Planning Mode",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      dot: "bg-amber-400",
    },
    voting: {
      label: "Voting Active",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      dot: "bg-emerald-400 animate-pulse",
    },
    scheduled: {
      label: "Event Scheduled",
      badge: "bg-violet-500/20 text-violet-300 border-violet-500/40",
      dot: "bg-violet-400",
    },
  }[group.room.status] ?? {
    label: group.room.status,
    badge: "bg-black/60 text-white border-white/20",
    dot: "bg-muted",
  };

  const totalVotes = group.items.reduce((acc, item) => acc + scoreVotes(item.votes), 0);
  const bannerImage = group.items[0]?.item.image || getCategoryFallbackImage("Lifestyle", group.name);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-border bg-card shadow-sm transition-all duration-300 hover:border-[var(--theme-accent)]/50 hover:shadow-xl hover:shadow-[var(--theme-accent-glow)]/10">
      {/* Visual Photography Header Banner */}
      <div className="relative h-36 w-full overflow-hidden bg-muted/20">
        <SafeImage
          src={bannerImage}
          alt={group.name}
          category="Lifestyle"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-black/20" />

        {/* Header badges over image */}
        <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${statusConfig.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </span>
          <span className="rounded-full bg-black/60 px-2.5 py-1 font-mono text-xs font-medium text-white/90 backdrop-blur-md">
            Code: <strong className="text-white">{group.inviteCode}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 pt-3">
        <div>
          {/* Group Name & Description */}
          <h3 className="editorial text-2xl font-bold tracking-tight text-fg transition-colors group-hover:text-[var(--theme-accent)]">
            {group.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
            {group.description || group.room.notes || "Collaborative space for sharing and voting on discovery picks."}
          </p>

          {/* Room Topic / Title */}
          {group.room.title && (
            <div className="mt-4 rounded-xl border border-border/70 bg-card-strong/60 p-3 text-xs">
              <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">Active Room Topic</span>
              <p className="mt-0.5 font-medium text-fg">{group.room.title}</p>
            </div>
          )}

          {/* Participants Avatar Cluster */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Participants ({group.members.length})
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {group.members.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    title={`${member.name}${member.isYou ? " (You)" : ""}`}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-2 ring-card shadow-sm ${
                      member.isYou
                        ? "bg-[var(--theme-accent)] text-white"
                        : "bg-chip text-fg"
                    }`}
                  >
                    {member.initials}
                  </div>
                ))}
              </div>
              {group.members.length > 5 && (
                <span className="text-xs text-muted">+{group.members.length - 5} more</span>
              )}
              <span className="ml-auto text-xs text-muted">
                {group.items.length} {group.items.length === 1 ? "pick" : "picks"} shared
                {group.items.length > 0 && ` • ${totalVotes > 0 ? `+${totalVotes}` : totalVotes} votes`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
          <Link
            href={`/together/${group.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:scale-[1.02] active:scale-95"
          >
            Open Room
            <span>→</span>
          </Link>

          {onCopyInvite && (
            <button
              type="button"
              onClick={() => onCopyInvite(group.inviteCode)}
              className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-[var(--theme-accent)] hover:text-fg"
            >
              {isCopied ? "✓ Invite Copied" : "Copy Invite Link"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function TogetherSharedItemCard({
  shared,
  groupId,
}: {
  shared: SharedGroupItem;
  groupId: string;
}) {
  const dispatch = useAppDispatch();
  const currentVote = shared.votes[YOU.id];
  const totalScore = scoreVotes(shared.votes);
  const [animating, setAnimating] = useState(false);

  const handleVote = (value: 1 | -1) => {
    setAnimating(true);
    dispatch(voteShared({ groupId, sharedId: shared.id, value }));
    if (currentVote === value) {
      toast.info("Vote cleared");
    } else {
      toast.success(value === 1 ? "Upvoted recommendation" : "Downvoted recommendation");
    }
    setTimeout(() => setAnimating(false), 300);
  };

  const scoreColor =
    totalScore > 0
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : totalScore < 0
      ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
      : "text-muted bg-chip border-border";

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition-all duration-300 hover:border-[var(--theme-accent)]/40 hover:shadow-lg">
      {/* Top Banner: Member who shared */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-card-strong/40 px-5 py-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--theme-accent)]/20 font-bold text-[var(--theme-accent)] text-[11px]">
            {shared.addedBy.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-fg">
            Added by <strong className="text-fg">{shared.addedBy === YOU.id ? "You" : shared.addedBy}</strong>
          </span>
        </div>
        <span className="text-[11px] text-muted">
          {new Date(shared.addedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Embedded Polymorphic Content Card */}
      <div className="p-3">
        <ContentCard item={shared.item} />
      </div>

      {/* Collaborative Voting & Discussion Ballot Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-card-strong/60 px-5 py-3.5">
        {/* Voting controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Upvote this recommendation"
            onClick={() => handleVote(1)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
              currentVote === 1
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400"
                : "border border-border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
            }`}
          >
            <span>▲</span>
            <span>Upvote</span>
          </button>

          <button
            type="button"
            aria-label="Downvote this recommendation"
            onClick={() => handleVote(-1)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
              currentVote === -1
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-400"
                : "border border-border bg-card hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
            }`}
          >
            <span>▼</span>
            <span>Downvote</span>
          </button>
        </div>

        {/* Group Consensus Score Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Group score:</span>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-bold transition-transform ${scoreColor} ${
              animating ? "scale-110" : "scale-100"
            }`}
          >
            {totalScore > 0 ? `+${totalScore}` : totalScore}
          </span>
        </div>
      </div>
    </div>
  );
}
