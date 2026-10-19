"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Film, Disc3, Compass, Sparkles, Play } from "lucide-react";

interface CultureWallProps {
  className?: string;
  themeMode?: "dark" | "light";
}

interface WallItem {
  id: string;
  title: string;
  category: "Cinema" | "Sound" | "Architecture" | "Places" | "Art";
  icon: React.ReactNode;
  imageUrl: string;
  aspect: string;
  className: string;
  depth: number;
  rotation: number;
  badge?: string;
}

export function CultureWall({
  className = "",
  themeMode = "dark",
}: CultureWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isLight = themeMode === "light";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [prefersReducedMotion]);

  // Curated culture wall panels positioned within the dedicated collage stage
  const items: WallItem[] = [
    {
      id: "cinema-hero",
      title: "Paris, Texas (1984)",
      category: "Cinema",
      icon: <Film className="w-3 h-3 text-amber-400" />,
      imageUrl:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[16/10]",
      className:
        "top-[0%] left-[5%] w-[54%] sm:w-[48%] lg:w-[50%] z-10 shadow-2xl",
      depth: 0.03,
      rotation: -1.5,
      badge: "35MM ARCHIVE",
    },
    {
      id: "vinyl-turntable",
      title: "Blue Note Sessions",
      category: "Sound",
      icon: <Disc3 className="w-3 h-3 text-rose-400" />,
      imageUrl:
        "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-square",
      className:
        "top-[4%] right-[5%] w-[38%] sm:w-[34%] lg:w-[35%] z-20 shadow-2xl",
      depth: 0.06,
      rotation: 2.0,
      badge: "VINYL 33 RPM",
    },
    {
      id: "concert-atmosphere",
      title: "Sonic Architecture",
      category: "Sound",
      icon: <Play className="w-3 h-3 text-blue-400" />,
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[4/3]",
      className:
        "top-[38%] left-[4%] w-[40%] sm:w-[35%] lg:w-[37%] z-15 shadow-xl",
      depth: 0.04,
      rotation: 1.2,
      badge: "BERLIN LIVE",
    },
    {
      id: "architecture-brutalist",
      title: "Pavilion in Light",
      category: "Architecture",
      icon: <Compass className="w-3 h-3 text-amber-300" />,
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[16/11]",
      className:
        "top-[34%] right-[5%] w-[50%] sm:w-[44%] lg:w-[46%] z-12 shadow-2xl",
      depth: 0.05,
      rotation: -1.0,
      badge: "HABITAT 08",
    },
    {
      id: "places-listening-bar",
      title: "Dusk Listening Lounge",
      category: "Places",
      icon: <Sparkles className="w-3 h-3 text-amber-400" />,
      imageUrl:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[16/10]",
      className:
        "top-[54%] left-[26%] w-[48%] sm:w-[42%] lg:w-[44%] z-25 shadow-2xl",
      depth: 0.07,
      rotation: 0.8,
      badge: "TOKYO KISSA",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-0 lg:min-h-screen overflow-hidden select-none flex flex-col justify-between transition-colors duration-500 ${isLight ? "bg-[#EDE6DC]" : "bg-[#07080C]"
        } ${className}`}
    >
      {/* 1. Deep Atmospheric Spatial Background */}
      <div className="absolute inset-0 pointer-events-none">
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAF5EE] via-[#EDE6DC] to-[#E3DACB]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(215,183,122,0.2),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(114,44,58,0.08),transparent_65%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#07080C]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F0B10] via-[#07080C] to-[#0A0D14]" />
            <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(97,28,46,0.24),transparent_70%)] blur-3xl" />
            <div className="absolute top-[40%] -right-[15%] w-[55%] h-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(184,91,50,0.18),transparent_70%)] blur-3xl" />
            <div className="absolute -bottom-[15%] left-[20%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(40,55,95,0.2),transparent_70%)] blur-3xl" />
          </>
        )}

        {/* 35mm film grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 2. Top Header: Clean unclipped Pluto Wordmark */}
      <div className="relative z-30 pt-6 sm:pt-8 lg:pt-12 px-6 sm:px-10 lg:px-14 shrink-0">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
          aria-label="Pluto home"
        >
          <span
            className={`font-serif text-3xl sm:text-4xl font-normal tracking-tight transition-opacity ${isLight ? "text-neutral-900 group-hover:opacity-80" : "text-white group-hover:opacity-80"
              }`}
          >
            Pluto
          </span>
          <span
            className={`h-4 w-px ${isLight ? "bg-neutral-400/40" : "bg-white/20"}`}
          />
          <span
            className={`font-mono text-[10px] tracking-[0.22em] uppercase font-semibold ${isLight ? "text-amber-800/80" : "text-amber-200/75"
              }`}
          >
            Culture Archive
          </span>
        </Link>
      </div>

      {/* 3. Dedicated Central Collage Stage (Confined between Header and Footer copy) */}
      <div className="relative w-full my-auto h-[240px] sm:h-[300px] lg:h-[360px] pointer-events-none">
        <div className="absolute inset-0 px-4 sm:px-8">
          {items.map((item) => {
            const offsetX = prefersReducedMotion ? 0 : mousePos.x * item.depth * 35;
            const offsetY = prefersReducedMotion ? 0 : mousePos.y * item.depth * 35;

            return (
              <div
                key={item.id}
                className={`absolute transition-transform duration-700 ease-out pointer-events-auto ${item.className}`}
                style={{
                  transform: `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${item.rotation}deg)`,
                }}
              >
                <div
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.03] hover:z-30 ${isLight
                    ? "bg-[#FFFDF9] border-[#DDD3C4] shadow-[0_15px_35px_-8px_rgba(37,32,42,0.14)] hover:shadow-[0_25px_50px_-10px_rgba(37,32,42,0.22)]"
                    : "bg-[#10121A] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-amber-400/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                    }`}
                >
                  <div className={`relative w-full ${item.aspect} overflow-hidden`}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92] contrast-[1.05]"
                    />

                    {/* Subtle gradient vignette on image */}
                    <div
                      className={`absolute inset-0 ${isLight
                        ? "bg-gradient-to-t from-black/45 via-transparent to-black/10"
                        : "bg-gradient-to-t from-[#07080C]/85 via-black/20 to-black/30"
                        }`}
                    />

                    {/* Micro Editorial Badge on panel */}
                    {item.badge && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-wider text-amber-200/90 uppercase">
                        {item.icon}
                        <span>{item.badge}</span>
                      </div>
                    )}

                    {/* Bottom Image Caption on Hover */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/95 font-medium">
                      <span className="truncate drop-shadow-md">{item.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Brand Statement Zone with Readable Contrast Shield */}
      <div className="relative z-30 pb-6 sm:pb-8 lg:pb-10 px-6 sm:px-10 lg:px-14 shrink-0 max-w-lg">
        {/* Soft backdrop blur & gradient capsule for 100% legibility */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 dark:bg-white/[0.06] backdrop-blur-md border border-black/10 dark:border-white/10 text-[10px] font-mono tracking-wider uppercase text-amber-700 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />

          </div>

          <h1
            className={`font-serif text-2xl sm:text-3xl lg:text-[38px] font-normal leading-[1.16] tracking-tight ${isLight ? "text-neutral-950" : "text-white"
              }`}
          >
            The world is full of things you&apos;ll love.
          </h1>

          <p
            className={`text-xs sm:text-sm lg:text-base leading-relaxed ${isLight ? "text-neutral-700" : "text-neutral-300/85"
              }`}
          >
            Films, sounds, places, and ideas. Find the things that feel like you.
          </p>
        </div>
      </div>
    </div>
  );
}
