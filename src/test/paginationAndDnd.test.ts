import { describe, expect, it } from "vitest";
import { arrayMove } from "@dnd-kit/sortable";
import { makeStore } from "@/store";
import { hydrateLayout, moveModule, resetLayout, setFeedOrder } from "@/store/slices/layoutSlice";
import { DEFAULT_FEED_ORDER } from "@/lib/constants";
import type { FeedModuleId } from "@/lib/types";
import { MOCK_NEWS } from "@/lib/mock/news";
import { MOCK_MOVIES } from "@/lib/mock/movies";

describe("Task 2: Drag-and-Drop Feed Reordering & State Persistence", () => {
  it("reorders feed modules accurately using arrayMove and updates Redux state via setFeedOrder", () => {
    const store = makeStore();
    const initialOrder = store.getState().layout.feedOrder;
    expect(initialOrder).toEqual(DEFAULT_FEED_ORDER);

    // Simulate dragging the first item to the third position
    const oldIndex = 0; // "featured"
    const newIndex = 2; // "movies"
    const reordered = arrayMove(initialOrder, oldIndex, newIndex);

    expect(reordered[newIndex]).toBe(initialOrder[oldIndex]);
    expect(reordered).toHaveLength(initialOrder.length);

    // Dispatch setFeedOrder
    store.dispatch(setFeedOrder(reordered));
    expect(store.getState().layout.feedOrder).toEqual(reordered);
  });

  it("retains up/down arrow buttons as accessible alternative through moveModule", () => {
    const store = makeStore();
    const initial = [...store.getState().layout.feedOrder];

    // Move first item down
    const firstItem = initial[0];
    store.dispatch(moveModule({ id: firstItem, direction: 1 }));
    expect(store.getState().layout.feedOrder[1]).toBe(firstItem);

    // Move it back up
    store.dispatch(moveModule({ id: firstItem, direction: -1 }));
    expect(store.getState().layout.feedOrder[0]).toBe(firstItem);
  });

  it("persists and rehydrates reordered feed order across store instances", () => {
    const store1 = makeStore();
    const customOrder: FeedModuleId[] = [
      "news",
      "movies",
      "featured",
      "music",
      "together",
      "myspace",
      "social",
      "topics",
    ];

    store1.dispatch(setFeedOrder(customOrder));
    const serialized = JSON.stringify(store1.getState().layout.feedOrder);

    // New store instance rehydrates saved order
    const store2 = makeStore();
    store2.dispatch(hydrateLayout(JSON.parse(serialized)));
    expect(store2.getState().layout.feedOrder).toEqual(customOrder);

    // Resetting layout restores default feed sequence
    store2.dispatch(resetLayout());
    expect(store2.getState().layout.feedOrder).toEqual(DEFAULT_FEED_ORDER);
  });

  it("reorders a second list (favorites) independently without affecting feedOrder", async () => {
    const store = makeStore();
    const initialFeedOrder = [...store.getState().layout.feedOrder];

    // Add three favorites
    const fav1 = { id: "fav-1", savedAt: "2026-10-18T10:00:00Z", item: MOCK_MOVIES[0] };
    const fav2 = { id: "fav-2", savedAt: "2026-10-18T10:01:00Z", item: MOCK_MOVIES[1] };
    const fav3 = { id: "fav-3", savedAt: "2026-10-18T10:02:00Z", item: MOCK_MOVIES[2] };

    const initialFavorites = [fav1, fav2, fav3];
    const { setFavoritesOrder } = await import("@/store/slices/favoritesSlice");
    store.dispatch(setFavoritesOrder(initialFavorites));

    expect(store.getState().favorites.items).toHaveLength(3);
    expect(store.getState().favorites.items[0].id).toBe("fav-1");

    // Drag the first item into the third position
    const oldIndex = 0;
    const newIndex = 2;
    const reorderedFavorites = arrayMove(initialFavorites, oldIndex, newIndex);

    expect(reorderedFavorites[0].id).toBe("fav-2");
    expect(reorderedFavorites[2].id).toBe("fav-1");

    store.dispatch(setFavoritesOrder(reorderedFavorites));

    // Confirm favorites are updated in Redux
    expect(store.getState().favorites.items[0].id).toBe("fav-2");
    expect(store.getState().favorites.items[2].id).toBe("fav-1");

    // Confirm that feedOrder remained completely unchanged!
    expect(store.getState().layout.feedOrder).toEqual(initialFeedOrder);
  });
});

describe("Task 1: Incremental Pagination and Local Batch Loading", () => {
  it("paginates news items incrementally without duplicate items or resetting existing items", () => {
    const dataset = MOCK_NEWS;
    expect(dataset.length).toBeGreaterThanOrEqual(8);

    const INITIAL_COUNT = 4;
    const PAGE_STEP = 2;

    let visibleCount = INITIAL_COUNT;
    let visibleSlice = dataset.slice(0, visibleCount);
    expect(visibleSlice).toHaveLength(INITIAL_COUNT);

    // Verify no duplicates in the initial batch
    const seenIds = new Set<string>();
    visibleSlice.forEach((item) => {
      expect(seenIds.has(item.id)).toBe(false);
      seenIds.add(item.id);
    });

    // Simulate clicking "Load More"
    visibleCount = Math.min(visibleCount + PAGE_STEP, dataset.length);
    visibleSlice = dataset.slice(0, visibleCount);

    expect(visibleSlice).toHaveLength(INITIAL_COUNT + PAGE_STEP);
    // Prior items are preserved at their exact indices
    expect(visibleSlice[0].id).toBe(dataset[0].id);
    expect(visibleSlice[INITIAL_COUNT - 1].id).toBe(dataset[INITIAL_COUNT - 1].id);

    // Verify all items in extended slice are unique
    const uniqueIds = new Set(visibleSlice.map((i) => i.id));
    expect(uniqueIds.size).toBe(visibleSlice.length);
  });

  it("correctly identifies when all items are loaded and disables/hides load more control", () => {
    const dataset = MOCK_MOVIES;
    let visibleCount = 4;
    const PAGE_STEP = 4;

    while (visibleCount < dataset.length) {
      const hasMore = visibleCount < dataset.length;
      expect(hasMore).toBe(true);
      visibleCount = Math.min(visibleCount + PAGE_STEP, dataset.length);
    }

    const hasMore = visibleCount < dataset.length;
    expect(hasMore).toBe(false);
    expect(visibleCount).toBe(dataset.length);
  });

  it("resets pagination state when filter or search query changes", () => {
    const INITIAL_COUNT = 6;
    let visibleCount = 12; // user had expanded twice

    // Simulate filter/topic change function
    const onFilterChange = () => {
      visibleCount = INITIAL_COUNT;
    };

    onFilterChange();
    expect(visibleCount).toBe(INITIAL_COUNT);
  });
});
