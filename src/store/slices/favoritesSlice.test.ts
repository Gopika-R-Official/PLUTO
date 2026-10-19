import { describe, expect, it } from "vitest";
import type { ContentItem } from "@/lib/types";
import { makeStore } from "../index";
import { toggleFavorite } from "./favoritesSlice";

const sample: ContentItem = {
  id: "news-1",
  type: "news",
  title: "A story",
  description: "Body",
  image: null,
  categories: ["Technology"],
  source: "test",
  url: null,
  publishedAt: null,
  provenance: "mock",
  metadata: {},
};

describe("favorites", () => {
  it("adds and removes an item", () => {
    const store = makeStore();
    store.dispatch(toggleFavorite(sample));
    expect(store.getState().favorites.items).toHaveLength(1);
    store.dispatch(toggleFavorite(sample));
    expect(store.getState().favorites.items).toHaveLength(0);
  });
});
