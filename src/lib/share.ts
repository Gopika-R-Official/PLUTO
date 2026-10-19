import { toast } from "@/components/ui/Toast";
import type { ContentItem } from "./types";

/**
 * Universal Share Helper
 * Connects to /api/share backend endpoint, uses Web Share API when supported,
 * and provides direct links to social networks.
 */

async function notifyShareApi(item: ContentItem, platform: string, url: string) {
  try {
    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.id,
        title: item.title,
        url,
        platform,
      }),
    });
  } catch {
    // Non-blocking telemetry
  }
}

export function getShareUrl(item: ContentItem): string {
  if (item.url && item.url.startsWith("http")) return item.url;
  if (typeof window !== "undefined") {
    return `${window.location.origin}/search?q=${encodeURIComponent(item.title)}`;
  }
  return `https://pluto.app/search?q=${encodeURIComponent(item.title)}`;
}

export function getPlatformShareUrl(item: ContentItem, platform: "twitter" | "whatsapp" | "reddit" | "linkedin"): string {
  const url = encodeURIComponent(getShareUrl(item));
  const text = encodeURIComponent(`Checking out "${item.title}" on Pluto Discovery`);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    case "reddit":
      return `https://reddit.com/submit?url=${url}&title=${text}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    default:
      return url;
  }
}

export async function shareToPlatform(
  item: ContentItem,
  platform: "twitter" | "whatsapp" | "reddit" | "linkedin",
) {
  const shareUrl = getShareUrl(item);
  await notifyShareApi(item, platform, shareUrl);
  const targetUrl = getPlatformShareUrl(item, platform);
  if (typeof window !== "undefined") {
    window.open(targetUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  }
  toast.success(`Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)} share...`);
}

export async function shareContent(item: ContentItem): Promise<boolean> {
  const shareUrl = getShareUrl(item);

  const shareData: ShareData = {
    title: item.title,
    text: item.description ? item.description.slice(0, 160) : item.title,
    url: shareUrl,
  };

  // Try Web Share API if supported
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        await notifyShareApi(item, "web-share-native", shareUrl);
        toast.success("Shared successfully!");
        return true;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return false;
      }
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      const textToCopy = `${item.title} — ${shareUrl}`;
      await navigator.clipboard.writeText(textToCopy);
      await notifyShareApi(item, "clipboard", shareUrl);
      toast.success("Link copied to clipboard!");
      return true;
    } catch {
      toast.error("Unable to copy to clipboard.");
      return false;
    }
  }

  toast.info("Sharing is unavailable in this environment.");
  return false;
}
