import crypto from "node:crypto";
import { getCategoryFallbackImage } from "./images";
import type { ContentItem, Interest } from "./types";

const FEEDS: Record<Interest, string> = {
  Technology: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  Business: "https://feeds.bbci.co.uk/news/business/rss.xml",
  Science: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
  Finance: "https://feeds.bbci.co.uk/news/business/rss.xml",
  Movies: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
  Music: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
  Sports: "https://feeds.bbci.co.uk/sport/rss.xml",
  Design: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  Lifestyle: "https://feeds.bbci.co.uk/news/uk/rss.xml",
  Travel: "https://feeds.bbci.co.uk/news/world/rss.xml",
  Gaming: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  Social: "https://feeds.bbci.co.uk/news/technology/rss.xml",
};

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string | null {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decode(match[1]) : null;
}

function imageFrom(block: string): string | null {
  const media =
    block.match(/url="(https?:\/\/[^"]+)"/i) ||
    block.match(/<enclosure[^>]+url="(https?:\/\/[^"]+)"/i) ||
    block.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
  return media?.[1] ?? null;
}

function makeNewsId(guid: string | null, link: string | null, title: string, category: string, index: number): string {
  const seed = (guid || link || `${category}-${title}-${index}`).trim().toLowerCase();
  const hash = crypto.createHash("sha256").update(seed).digest("hex").slice(0, 16);
  return `news-${hash}`;
}

export function parseRssItems(xml: string, category: Interest, limit = 8): ContentItem[] {
  const chunks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  return chunks.slice(0, limit).map((block, index) => {
    const title = tag(block, "title") ?? "Untitled story";
    const link = tag(block, "link");
    const description = tag(block, "description") ?? "";
    const pubDate = tag(block, "pubDate");
    const guid = tag(block, "guid");
    const id = makeNewsId(guid, link, title, category, index);

    return {
      id,
      type: "news" as const,
      title,
      description: description.slice(0, 240),
      image: imageFrom(block) || getCategoryFallbackImage(category, title),
      categories: [category],
      source: "BBC News",
      url: link,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
      provenance: "live" as const,
      metadata: {},
    };
  });
}

export async function fetchNewsFromRss(
  interests: Interest[],
  query?: string,
): Promise<ContentItem[]> {
  const topics = interests.length > 0 ? interests : (["Technology", "Business"] as Interest[]);
  const uniqueFeeds = [...new Map(topics.map((t) => [FEEDS[t], t])).entries()];

  const results = await Promise.allSettled(
    uniqueFeeds.map(async ([url, topic]) => {
      const response = await fetch(url, {
        headers: { "User-Agent": "PlutoDiscovery/1.0" },
        next: { revalidate: 600 },
      });
      if (!response.ok) throw new Error(`RSS ${response.status}`);
      const xml = await response.text();
      return parseRssItems(xml, topic);
    }),
  );

  const items = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const deduped: ContentItem[] = [];

  for (const item of items) {
    const normTitle = item.title.trim().toLowerCase();
    if (!seenIds.has(item.id) && !seenTitles.has(normTitle)) {
      seenIds.add(item.id);
      seenTitles.add(normTitle);
      deduped.push(item);
    } else {
      const match = deduped.find(
        (existing) =>
          existing.id === item.id ||
          existing.title.trim().toLowerCase() === normTitle,
      );
      if (match) {
        match.categories = Array.from(new Set([...match.categories, ...item.categories]));
      }
    }
  }

  if (query?.trim()) {
    const q = query.toLowerCase();
    return deduped.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
    );
  }

  return deduped;
}
