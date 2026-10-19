"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";

interface TiltedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  className?: string;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TiltedCard({
  children,
  maxTilt = 7,
  scale = 1.02,
  glare = true,
  className = "",
  ...props
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    if ((e.target as HTMLElement)?.closest("button, a, input, [role='button']")) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x, y });
  };

  const handlePointerLeave = () => {
    setCoords(null);
  };

  const rotateX = coords && !reducedMotion ? -coords.y * maxTilt * 2 : 0;
  const rotateY = coords && !reducedMotion ? coords.x * maxTilt * 2 : 0;
  const currentScale = coords && !reducedMotion ? scale : 1;
  const glareX = coords ? (coords.x + 0.5) * 100 : 50;
  const glareY = coords ? (coords.y + 0.5) * 100 : 50;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: 1200 }}
      className={`relative transition-transform duration-300 ease-out ${className}`}
      {...props}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${currentScale}, ${currentScale}, 1)`,
          transition: coords
            ? "transform 0.1s ease-out"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative h-full w-full rounded-[inherit] overflow-hidden"
      >
        {children}

        {glare && !reducedMotion && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: coords ? 0.22 : 0,
              background: `radial-gradient(circle 380px at ${glareX}% ${glareY}%, rgba(255,255,255,0.7), transparent 70%)`,
              mixBlendMode: "overlay",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
