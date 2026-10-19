"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delayMs?: number;
  threshold?: number;
  distancePx?: number;
  className?: string;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ScrollReveal({
  children,
  delayMs = 0,
  threshold = 0.12,
  distancePx = 28,
  className = "",
  style,
  ...props
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    // Eagerly reveal if within viewport or nearby
    const rect = node.getBoundingClientRect();
    if (rect.top < (typeof window !== "undefined" ? window.innerHeight * 2 : 1000)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "200px 0px 200px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion, threshold]);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className={className} style={style} {...props} data-revealed="true">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-revealed={isVisible}
      className={`transition-all duration-700 ease-out will-change-[opacity,transform] ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : `translate3d(0, ${distancePx}px, 0)`,
        transitionDelay: `${delayMs}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
