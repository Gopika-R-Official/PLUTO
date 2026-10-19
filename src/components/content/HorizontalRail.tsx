"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";

interface HorizontalRailProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  actionLink?: { href: string; label: string };
  children: React.ReactNode;
  id?: string;
}

export function HorizontalRail({
  title,
  subtitle,
  badge,
  badgeColor = "border-blue-500/30 text-blue-500 bg-blue-500/10",
  icon,
  actionLink,
  children,
  id,
}: HorizontalRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [children]);

  const scroll = (direction: -1 | 1) => {
    if (!scrollRef.current) return;
    const scrollDistance = scrollRef.current.clientWidth * 0.75 * direction;
    scrollRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  return (
    <section id={id} className="relative space-y-4">
      {/* Header Strip */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-fg">
                {icon}
              </span>
            )}
            {badge && (
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}
              >
                {badge}
              </span>
            )}
          </div>
          <h2 className="editorial mt-1 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>

        {/* Action link and navigation buttons */}
        <div className="flex items-center gap-3">
          {actionLink && (
            <Link
              href={actionLink.href}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {actionLink.label} →
            </Link>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} left`}
              className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-fg disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} right`}
              className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-fg disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>
    </section>
  );
}
