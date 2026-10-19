"use client";

import React, { useSyncExternalStore } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  delayMs?: number;
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

export function AnimatedText({
  text,
  className = "",
  as: Component = "span",
  delayMs = 0,
}: AnimatedTextProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  if (reducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const words = text.split(" ");

  return (
    <Component className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block transition-all duration-700 ease-out animate-fadeIn"
          style={{
            animationDelay: `${delayMs + i * 45}ms`,
            marginRight: i === words.length - 1 ? "0" : "0.25em",
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
}
