"use client";

import { getCategoryFallbackImage } from "@/lib/images";
import type { Interest } from "@/lib/types";
import { useState } from "react";

export function SafeImage({
  src,
  alt,
  category,
  fallbackSrc,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  category?: Interest | string | null;
  fallbackSrc?: string;
  className?: string;
}) {
  const [hasFailed, setHasFailed] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset failure tracking during render when src prop changes (React recommended pattern)
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasFailed(false);
    setIsLoaded(false);
  }

  const defaultFallback = fallbackSrc || getCategoryFallbackImage(category, alt);
  const displaySrc = !hasFailed && src ? src : defaultFallback;

  return (
    // External editorial imagery from mixed hosts; fallback keeps layout stable and beautiful.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={displaySrc}
      alt={alt}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasFailed(true)}
      className={`${className ?? ""} ${
        isLoaded ? "opacity-100" : "opacity-90"
      } transition-opacity duration-300`}
    />
  );
}
