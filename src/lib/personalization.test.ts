import { describe, expect, it } from "vitest";
import { defaultPreferences } from "@/store/slices/preferencesSlice";
import { clampBoost, matchesQuery, rankContent, scoreItem } from "./personalization";
import type { ContentItem } from "./types";

function item(partial: Partial<ContentItem> & Pick<ContentItem, "id" | "title" | "type">): ContentItem {
  return {
    description: "",
    image: null,
    categories: [],
    source: "test",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: {},
    ...partial,
  };
}

describe("personalization scoring", () => {
  it("boosts matching interests more than unrelated items", () => {
    const prefs = { ...defaultPreferences, interests: ["Technology" as const] };
    const tech = item({ id: "a", title: "A", type: "news", categories: ["Technology"] });
    const sports = item({ id: "b", title: "B", type: "news", categories: ["Sports"] });
    expect(scoreItem(tech, prefs)).toBeGreaterThan(scoreItem(sports, prefs));
  });

  it("caps topic boosts", () => {
    expect(clampBoost(40)).toBe(6);
    expect(clampBoost(-40)).toBe(-6);
  });

  it("hides dismissed items from ranking", () => {
    const prefs = { ...defaultPreferences, dismissedIds: ["gone"] };
    const gone = item({ id: "gone", title: "Gone", type: "news", categories: ["Technology"] });
    const stay = item({ id: "stay", title: "Stay", type: "news", categories: ["Sports"] });
    expect(rankContent([gone, stay], prefs).map((entry) => entry.id)).toEqual(["stay"]);
  });

  it("does not let a single open dominate interest matching", () => {
    const prefs = {
      ...defaultPreferences,
      interests: ["Music" as const],
      openCounts: { opened: 9 },
    };
    const opened = item({ id: "opened", title: "Opened", type: "news", categories: ["Sports"] });
    const music = item({ id: "music", title: "Music", type: "news", categories: ["Music"] });
    expect(scoreItem(music, prefs)).toBeGreaterThan(scoreItem(opened, prefs));
  });

  it("matches search queries across title and categories", () => {
    const movie = item({ id: "m", title: "Signal Hill", type: "movie", categories: ["Science"] });
    expect(matchesQuery(movie, "signal")).toBe(true);
    expect(matchesQuery(movie, "science")).toBe(true);
    expect(matchesQuery(movie, "zzzz")).toBe(false);
  });
});
