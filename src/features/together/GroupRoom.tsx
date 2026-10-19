"use client";

import { TogetherSharedItemCard } from "@/components/content/TogetherCard";
import { ContentCard } from "@/components/content/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { RoomStatus } from "@/lib/types";
import { MOCK_SOCIAL } from "@/lib/mock/social";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { shareToGroup, updateRoom } from "@/store/slices/togetherSlice";
import { toast } from "@/components/ui/Toast";
import Link from "next/link";
import { useMemo } from "react";

export function GroupRoom({ groupId }: { groupId: string }) {
  const dispatch = useAppDispatch();
  const group = useAppSelector((state) => state.together.groups.find((item) => item.id === groupId));
  const ranked = useMemo(() => {
    if (!group) return [];
    return [...group.items].sort((a, b) => score(b.votes) - score(a.votes));
  }, [group]);

  if (!group) {
    return (
      <EmptyState
        title="Group not found"
        body="This id is not in your local Together data."
        action={
          <Link href="/together" className="rounded-full bg-violet px-4 py-2 text-sm text-white">
            Back to Together
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link href="/together" className="text-sm text-muted hover:text-[var(--theme-accent)] transition">
        ← Back to All Lounges
      </Link>
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-[var(--theme-accent)]">
            Lounge {group.inviteCode}
          </p>
          <span className="rounded-full bg-chip px-2.5 py-0.5 text-[11px] text-muted">
            {group.members.length} participants
          </span>
        </div>
        <h1 className="editorial mt-2 text-4xl font-bold tracking-tight">{group.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{group.description}</p>
      </header>

      <section className="rounded-[2.2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Active Planning Board</p>
            <h2 className="editorial mt-1 text-2xl font-bold">{group.room.title}</h2>
          </div>
          <span className="rounded-full bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/30 px-3.5 py-1 text-xs font-bold text-[var(--theme-accent)] capitalize">
            {group.room.status}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{group.room.notes}</p>
        <p className="mt-2 text-xs text-muted">
          No synchronized streaming — this board synchronizes collective voting and scheduled agendas.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Board Title
            <input
              value={group.room.title}
              onChange={(event) => dispatch(updateRoom({ groupId, title: event.target.value }))}
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-bg px-4 text-sm focus:border-[var(--theme-accent)] focus:outline-none"
            />
          </label>
          <label className="text-sm">
            Target Date & Time
            <input
              type="datetime-local"
              value={group.room.scheduledFor ?? ""}
              onChange={(event) => dispatch(updateRoom({ groupId, scheduledFor: event.target.value || null }))}
              className="mt-1 h-11 w-full rounded-2xl border border-border bg-bg px-4 text-sm focus:border-[var(--theme-accent)] focus:outline-none"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm">
          Board Notes / Rules
          <textarea
            value={group.room.notes}
            onChange={(event) => dispatch(updateRoom({ groupId, notes: event.target.value }))}
            className="mt-1 min-h-20 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm focus:border-[var(--theme-accent)] focus:outline-none"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["planning", "voting", "scheduled"] as RoomStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => dispatch(updateRoom({ groupId, status }))}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                group.room.status === status
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                  : "bg-chip text-muted hover:text-fg"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="editorial text-3xl font-bold tracking-tight">Shared Recommendations</h2>
          <span className="text-xs text-muted font-medium">{ranked.length} shortlisted items</span>
        </div>
        {ranked.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Nothing shared yet"
              body="Add recommendations from Discover or quick-share a sample below to start voting."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {ranked.map((shared) => (
              <TogetherSharedItemCard key={shared.id} shared={shared} groupId={groupId} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="editorial text-2xl">Add a sample post</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {MOCK_SOCIAL.slice(0, 4).map((item) => (
            <div key={item.id}>
              <ContentCard item={item} variant="social" />
              <button
                type="button"
                className="mt-2 rounded-full border border-border px-4 py-2 text-sm hover:border-[var(--theme-accent)] transition"
                onClick={() => {
                  dispatch(shareToGroup({ groupId, item }));
                  toast.success(`Added "${item.title}" to shared room!`);
                }}
              >
                Add to this group
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function score(votes: Record<string, 1 | -1>) {
  return Object.values(votes).reduce((sum, value) => sum + value, 0);
}
