"use client";

import { TogetherGroupCard } from "@/components/content/TogetherCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createGroup, joinByCode } from "@/store/slices/togetherSlice";
import { toast } from "@/components/ui/Toast";
import { ArrowRight, KeyRound, Plus, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TEMPLATES = [
  { name: "Friday Movie Night", desc: "Shortlist films from TMDB, vote on popcorn watch." },
  { name: "Longform & Coffee", desc: "Weekend reads, essays, and deep-dive science pieces." },
  { name: "Sonic Soundstage", desc: "Album drops, track previews, and vinyl finds." },
];

export function TogetherView() {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.together.groups);
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState(params.get("join") ?? "");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const join = params.get("join");
    if (join) dispatch(joinByCode(join));
  }, [dispatch, params]);

  const handleCopy = async (inviteCode: string) => {
    const url = `${window.location.origin}/together?join=${inviteCode}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(inviteCode);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Editorial Header */}
      <header className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-sm sm:p-10 card-tactile">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-blue-500" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-emerald-500" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-blue-400">
              <Users className="h-3.5 w-3.5" />
              TOGETHER LOUNGES · COLLABORATIVE SPACES
            </span>
            <span className="font-mono text-xs text-muted">
              {groups.length} active tables
            </span>
          </div>

          <h1 className="editorial mt-3 text-4xl font-bold tracking-tight text-fg sm:text-6xl">
            Share a table, not a feed
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Create collaborative discovery tables, invite friends via code, share recommendations from your feed, and vote in synchronized planning rooms.
          </p>
        </div>
      </header>

      {/* Creation & Joining Workspace */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Create Space Form */}
        <form
          className="relative overflow-hidden rounded-[2.2rem] border border-border bg-card p-7 shadow-sm transition card-tactile"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            const groupName = name.trim();
            dispatch(createGroup({ name: groupName, description: description.trim() }));
            toast.success(`Created "${groupName}" lounge!`);
            setName("");
            setDescription("");
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/15 text-blue-500">
                <Plus className="h-4 w-4" />
              </span>
              <h2 className="editorial text-2xl font-bold">New Collaborative Space</h2>
            </div>
            <span className="text-xs font-mono text-muted">Local Multi-Seat</span>
          </div>

          {/* Quick Idea Presets */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Quick ideas:</span>
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => {
                  setName(tmpl.name);
                  setDescription(tmpl.desc);
                }}
                className="rounded-full border border-border/80 bg-chip px-3 py-1 text-xs text-fg transition hover:border-fg"
              >
                + {tmpl.name}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
                htmlFor="group-name"
              >
                Lounge Name
              </label>
              <input
                id="group-name"
                required
                placeholder="e.g. Cinema Society or Tech Explorers"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-bg px-4 text-sm focus:border-fg focus:outline-none"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
                htmlFor="group-desc"
              >
                Description / Planning Goal
              </label>
              <textarea
                id="group-desc"
                placeholder="What are you organizing or discussing together?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1.5 min-h-20 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm focus:border-fg focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink text-paper dark:bg-paper dark:text-ink px-6 py-2.5 text-sm font-semibold shadow-md transition hover:scale-[1.02] active:scale-95"
          >
            Create Space
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Join With Code */}
        <form
          className="flex flex-col justify-between rounded-[2.2rem] border border-border bg-card-strong p-7 shadow-sm transition card-tactile"
          onSubmit={(event) => {
            event.preventDefault();
            if (!code.trim()) return;
            const normalized = code.trim().toUpperCase();
            const matched = groups.find((g) => g.inviteCode === normalized);
            if (matched) {
              dispatch(joinByCode(normalized));
              toast.success(`Joined ${matched.name}!`);
              setCode("");
            } else {
              toast.error("Invite code not found. Please check and try again.");
            }
          }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
                <KeyRound className="h-4 w-4" />
              </span>
              <h2 className="editorial text-2xl font-bold">Join with Code</h2>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              Enter an invite code (like <code className="text-fg font-mono">PLUTO-FRIDAY</code>) to join a collaborative discovery session.
            </p>

            <div className="mt-6">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
                htmlFor="invite"
              >
                Invite Code
              </label>
              <input
                id="invite"
                placeholder="e.g. PLUTO-FRIDAY"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="mt-1.5 h-11 w-full font-mono uppercase tracking-widest rounded-2xl border border-border bg-bg px-4 text-sm focus:border-fg focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-fg"
          >
            Join Lounge Table
          </button>
        </form>
      </div>

      {/* Lounges Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="editorial text-3xl font-bold tracking-tight">Active Lounges</h2>
          <span className="text-xs text-muted font-medium">{groups.length} active spaces</span>
        </div>

        {groups.length === 0 ? (
          <EmptyState
            title="No active groups"
            body="Create a group or enter an invite code to begin collaborative discovery."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {groups.map((group) => (
              <TogetherGroupCard
                key={group.id}
                group={group}
                onCopyInvite={() => handleCopy(group.inviteCode)}
                isCopied={copiedId === group.inviteCode}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
