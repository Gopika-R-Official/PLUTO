"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { DiscoveryGroup } from "@/lib/types";
import { ArrowRight, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

interface TogetherLoungesProps {
  groups: DiscoveryGroup[];
}

export function TogetherLounges({ groups }: TogetherLoungesProps) {
  if (groups.length === 0) return null;

  return (
    <ScrollReveal distancePx={24} threshold={0.08} className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
              <Users className="h-4 w-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              Discover Together: Shared Circles & Watchlists
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Collaborative watchlists, film votes, and shared planning rooms with friends.
          </p>
        </div>

        <Link
          href="/together"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>All Discovery Circles</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid of Active Lounges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
        {groups.map((group) => (
          <article
            key={group.id}
            className="flex flex-col justify-between rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-500/40"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{group.members.length} Friends Active</span>
                </span>
                <span className="rounded bg-chip px-2 py-0.5 text-[10px]">Code: {group.inviteCode}</span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-fg">
                {group.name}
              </h3>

              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                {group.description}
              </p>

              {group.room && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="h-3 w-3" />
                  <span>{group.room.title}</span>
                  <span className="opacity-60">({group.room.status})</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="flex -space-x-2">
                {group.members.slice(0, 4).map((member, i) => (
                  <span
                    key={member.id ?? `member-${i}`}
                    className="grid h-7 w-7 place-items-center rounded-full bg-card-strong text-[10px] font-bold text-fg ring-2 ring-card"
                    title={member.name}
                  >
                    {member.initials || member.name[0]}
                  </span>
                ))}
              </div>

              <Link
                href={`/together/${group.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-1.5 text-xs font-semibold text-bg transition hover:opacity-90"
              >
                <span>Enter Room</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </ScrollReveal>
  );
}
