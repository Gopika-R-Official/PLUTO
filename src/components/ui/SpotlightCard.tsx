"use client";

import React, { useCallback, useRef, useState } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor,
  spotlightSize = 340,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return;
      if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[1.8rem] border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#0c101d]/85 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-xl ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position?.x ?? 0}px ${position?.y ?? 0}px, ${
            spotlightColor || "var(--theme-accent-glow, rgba(99,102,241,0.18))"
          }, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle border highlight line */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          opacity: opacity * 0.7,
          background: `radial-gradient(${spotlightSize * 0.7}px circle at ${position?.x ?? 0}px ${position?.y ?? 0}px, rgba(255,255,255,0.4), transparent 60%)`,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
