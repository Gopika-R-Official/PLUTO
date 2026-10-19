"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
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

export function MagneticButton({
  children,
  strength = 18,
  className = "",
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || !buttonRef.current) return;
    if (window.matchMedia && !window.matchMedia("(pointer: fine)").matches) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
    setOffset({ x, y });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.1s ease-out",
      }}
      className={`relative cursor-pointer select-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
