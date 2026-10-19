"use client";

import type { Interest } from "@/lib/types";
import { Check } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

export interface SpotlightTileProps {
  id: Interest;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onToggle: (id: Interest) => void;
  accentColor?: string;
  badge?: string;
}

export function SpotlightTile({
  id,
  title,
  description,
  icon,
  selected,
  onToggle,
  badge,
}: SpotlightTileProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    // Only calculate spotlight for devices with fine pointer (mouse/trackpad)
    if (window.matchMedia("(pointer: fine)").matches) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition(null);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      ref={cardRef}
      role="checkbox"
      aria-checked={selected}
      aria-label={`${title}: ${description}`}
      tabIndex={0}
      onClick={() => onToggle(id)}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent,#6366f1)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] ${
        selected
          ? "border-[var(--theme-accent,#6366f1)] bg-card shadow-[0_0_25px_-5px_var(--theme-accent-glow,rgba(99,102,241,0.25))]"
          : "border-border/80 bg-card hover:border-border hover:bg-card-strong/60"
      }`}
    >
      {/* React Bits-inspired cursor spotlight overlay */}
      {position && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(220px circle at ${position.x}px ${position.y}px, var(--theme-accent-glow, rgba(99,102,241,0.18)), transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Ambient background glow when selected */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300 ${
          selected ? "opacity-30 bg-[var(--theme-accent,#6366f1)]" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Top: Icon + Selection Indicator */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={`grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl transition-colors duration-200 ${
            selected
              ? "bg-[var(--theme-accent,#6366f1)] text-white shadow-sm"
              : "bg-chip text-fg group-hover:bg-chip-hover"
          }`}
        >
          {icon}
        </div>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="hidden sm:inline-block rounded-full bg-chip px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted">
              {badge}
            </span>
          )}
          <div
            className={`grid h-5 w-5 place-items-center rounded-full border transition-all duration-200 ${
              selected
                ? "border-[var(--theme-accent,#6366f1)] bg-[var(--theme-accent,#6366f1)] text-white shadow-xs"
                : "border-border/80 bg-bg text-transparent group-hover:border-fg/40"
            }`}
          >
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Bottom: Title & Editorial Description */}
      <div className="relative z-10 mt-3 sm:mt-4">
        <h3
          className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-200 ${
            selected ? "text-fg" : "text-fg group-hover:text-fg"
          }`}
        >
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
          {description}
        </p>
      </div>

      {/* Subtle selection border indicator */}
      {selected && (
        <span
          className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--theme-accent,#6366f1)]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
