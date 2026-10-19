import {
  MAX_OPEN_SIGNAL,
  SIGNAL_WEIGHTS,
  TOPIC_BOOST_CAP,
} from "./constants";
import type { ContentItem, ContentType, Interest, PreferencesState } from "./types";

export function clampBoost(value: number): number {
  return Math.max(-TOPIC_BOOST_CAP, Math.min(TOPIC_BOOST_CAP, value));
}

export function scoreItem(item: ContentItem, preferences: PreferencesState): number {
  if (preferences.dismissedIds.includes(item.id)) {
    return -100;
  }

  let score = 0.2;

  for (const category of item.categories) {
    if (preferences.interests.includes(category as Interest)) {
      score += SIGNAL_WEIGHTS.interest;
    }
    if (preferences.followedTopics.includes(category as Interest)) {
      score += SIGNAL_WEIGHTS.followed;
    }
    const boost = preferences.topicBoosts[category] ?? 0;
    score += boost * SIGNAL_WEIGHTS.boost;
  }

  const opens = Math.min(preferences.openCounts[item.id] ?? 0, MAX_OPEN_SIGNAL);
  score += opens * SIGNAL_WEIGHTS.opened;

  return score;
}

function interleaveForVariety(items: ContentItem[]): ContentItem[] {
  const buckets = new Map<ContentType, ContentItem[]>();
  for (const item of items) {
    const list = buckets.get(item.type) ?? [];
    list.push(item);
    buckets.set(item.type, list);
  }

  const types = [...buckets.keys()];
  const result: ContentItem[] = [];
  let added = true;
  let lastType: ContentType | null = null;

  while (added) {
    added = false;
    const ordered = [...types].sort((a, b) => {
      if (a === lastType) return 1;
      if (b === lastType) return -1;
      return (buckets.get(b)?.length ?? 0) - (buckets.get(a)?.length ?? 0);
    });
    for (const type of ordered) {
      const bucket = buckets.get(type);
      if (bucket && bucket.length > 0) {
        result.push(bucket.shift()!);
        lastType = type;
        added = true;
        break;
      }
    }
  }

  return result;
}

export function rankContent(
  items: ContentItem[],
  preferences: PreferencesState,
): ContentItem[] {
  const seen = new Set<string>();
  const uniqueItems: ContentItem[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      uniqueItems.push(item);
    }
  }
  const visible = uniqueItems.filter((item) => !preferences.dismissedIds.includes(item.id));
  const ranked = [...visible].sort((a, b) => {
    const delta = scoreItem(b, preferences) - scoreItem(a, preferences);
    if (Math.abs(delta) > 0.05) return delta;
    return a.title.localeCompare(b.title);
  });
  return interleaveForVariety(ranked);
}

export function matchesQuery(item: ContentItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    item.title,
    item.description,
    item.source,
    ...item.categories,
    item.metadata.author ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
