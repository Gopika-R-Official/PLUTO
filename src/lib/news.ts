import { MOCK_NEWS } from "./mock/news";
import { fetchNewsFromRss } from "./rss";
import type { ContentItem, ContentResponse, Interest } from "./types";
import { INTERESTS } from "./constants";

function parseTopics(value: string | null): Interest[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part): part is Interest => INTERESTS.includes(part as Interest));
}

function filterMock(interests: Interest[], query?: string): ContentItem[] {
  let items = MOCK_NEWS;
  if (interests.length) {
    const matched = items.filter((item) =>
      item.categories.some((category) => interests.includes(category as Interest)),
    );
    items = matched.length ? matched : items;
  }
  if (query?.trim()) {
    const q = query.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
    );
  }
  return items;
}

export async function fetchNews(options: {
  topics?: string | null;
  query?: string;
}): Promise<ContentResponse> {
  const interests = parseTopics(options.topics ?? null);
  try {
    const items = await fetchNewsFromRss(interests, options.query);
    if (items.length > 0) {
      return { items, provenance: "live" };
    }
    return {
      items: filterMock(interests, options.query),
      provenance: "mock",
      message: "Live news feeds returned no stories. Showing labelled sample briefings.",
    };
  } catch {
    return {
      items: filterMock(interests, options.query),
      provenance: "mock",
      message: "Live news feeds are unavailable. Showing labelled sample briefings.",
    };
  }
}
