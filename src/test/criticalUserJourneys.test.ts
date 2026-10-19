import { describe, expect, it, vi, beforeEach } from "vitest";
import { makeStore } from "@/store";
import { hydrateFavorites, toggleFavorite } from "@/store/slices/favoritesSlice";
import { createGroup, joinByCode, voteShared, shareToGroup } from "@/store/slices/togetherSlice";
import { MOCK_MOVIES } from "@/lib/mock/movies";
import { MOCK_NEWS } from "@/lib/mock/news";
import { MOCK_MUSIC } from "@/lib/mock/music";
import { MOCK_RESTAURANTS } from "@/lib/mock/restaurants";
import { getRestaurantReservationUrl } from "@/lib/booking";
import { fetchMovieTrailerKey } from "@/lib/tmdb";
import { scoreVotes } from "@/components/content/TogetherCard";
import { audioEngine } from "@/lib/audioEngine";
import type { ContentItem } from "@/lib/types";

describe("Critical User Journeys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1 & 2: Save, persist, remove, and count synchronization", () => {
    it("saves an item, preserves it across rehydration, and updates count correctly", () => {
      const store1 = makeStore();
      const movie = MOCK_MOVIES[0];

      // Initially empty
      expect(store1.getState().favorites.items).toHaveLength(0);

      // Save item
      store1.dispatch(toggleFavorite(movie));
      expect(store1.getState().favorites.items).toHaveLength(1);
      expect(store1.getState().favorites.items[0].id).toBe(movie.id);

      // Simulate local storage persistence & rehydration in a new store instance
      const persistedJson = JSON.stringify(store1.getState().favorites.items);
      const rehydratedData = JSON.parse(persistedJson);

      const store2 = makeStore();
      store2.dispatch(hydrateFavorites(rehydratedData));
      expect(store2.getState().favorites.items).toHaveLength(1);
      expect(store2.getState().favorites.items[0].item.title).toBe(movie.title);

      // Remove the item and confirm count decrements back to 0
      store2.dispatch(toggleFavorite(movie));
      expect(store2.getState().favorites.items).toHaveLength(0);
    });
  });

  describe("3: News story URL resolution and honest unavailable handling", () => {
    it("identifies valid publisher URLs and detects items with missing URLs", () => {
      // News items with valid URLs
      const validItems = MOCK_NEWS.filter((item) => Boolean(item.url && item.url.startsWith("http")));
      expect(validItems.length).toBeGreaterThan(0);
      expect(validItems[0].url).toMatch(/^https?:\/\//);

      // News items intentionally missing URLs for fallback testing
      const missingUrlItems = MOCK_NEWS.filter((item) => !item.url);
      expect(missingUrlItems.length).toBeGreaterThan(0);
      expect(missingUrlItems[0].url).toBeNull();
    });
  });

  describe("4 & 5: Movie trailer resolution and missing trailer handling", () => {
    it("resolves valid trailer video IDs for canon movies", async () => {
      const interstellarKey = await fetchMovieTrailerKey("movie-157336");
      expect(interstellarKey).toBe("zSWdZVtXT7E");

      const spiritedAwayKey = await fetchMovieTrailerKey("movie-129");
      expect(spiritedAwayKey).toBe("ByXuk9QqQkk");
    });

    it("handles movie with no trailer gracefully by returning null instead of fake key", async () => {
      // Sans Soleil (movie-4982) was added with trailerKey: null
      const missingKey = await fetchMovieTrailerKey("movie-4982");
      expect(missingKey).toBeNull();
    });
  });

  describe("6: Music preview playback and honest missing preview state", () => {
    it("recognizes tracks with valid preview audio URLs and tracks without preview", () => {
      const trackWithPreview = MOCK_MUSIC.find((t) => Boolean(t.metadata.audioPreview));
      expect(trackWithPreview).toBeDefined();
      expect(trackWithPreview?.metadata.audioPreview).toMatch(/\.wav$/);

      const trackWithoutPreview = MOCK_MUSIC.find((t) => t.metadata.audioPreview === null);
      expect(trackWithoutPreview).toBeDefined();
      expect(trackWithoutPreview?.metadata.audioPreview).toBeNull();
    });

    it("audioEngine rejects playback when no preview URL is provided", async () => {
      const result = await audioEngine.play("test-no-url", null);
      expect(result).toBe(false);
      expect(audioEngine.isPlaying("test-no-url")).toBe(false);
    });
  });

  describe("7: Together room joining, voting, and consensus score calculation", () => {
    it("allows joining by code, adding shared items, and voting with duplicate prevention", () => {
      const store = makeStore();
      const initialGroup = store.getState().together.groups[0];
      const inviteCode = initialGroup.inviteCode;

      // Join room with valid code
      store.dispatch(joinByCode(inviteCode));
      const groupAfterJoin = store.getState().together.groups.find((g) => g.id === initialGroup.id);
      expect(groupAfterJoin?.members.some((m) => m.id === "you")).toBe(true);

      // Share an item
      const itemToShare: ContentItem = MOCK_MOVIES[0];
      store.dispatch(shareToGroup({ groupId: initialGroup.id, item: itemToShare }));

      const updatedGroup = store.getState().together.groups.find((g) => g.id === initialGroup.id);
      expect(updatedGroup?.items).toHaveLength(1);
      const sharedItem = updatedGroup!.items[0];

      // Initial vote by sharer is 1
      expect(scoreVotes(sharedItem.votes)).toBe(1);

      // Cast another upvote from YOU toggles vote off (duplicate prevention)
      store.dispatch(voteShared({ groupId: initialGroup.id, sharedId: sharedItem.id, value: 1 }));
      const toggledGroup = store.getState().together.groups.find((g) => g.id === initialGroup.id);
      expect(scoreVotes(toggledGroup!.items[0].votes)).toBe(0);

      // Cast a downvote (-1)
      store.dispatch(voteShared({ groupId: initialGroup.id, sharedId: sharedItem.id, value: -1 }));
      const downvotedGroup = store.getState().together.groups.find((g) => g.id === initialGroup.id);
      expect(scoreVotes(downvotedGroup!.items[0].votes)).toBe(-1);
    });

    it("creates a new collaborative room with valid invite code and state", () => {
      const store = makeStore();
      const initialCount = store.getState().together.groups.length;

      store.dispatch(createGroup({ name: "Cinema Society", description: "Weekend films" }));
      expect(store.getState().together.groups.length).toBe(initialCount + 1);

      const created = store.getState().together.groups[0];
      expect(created.name).toBe("Cinema Society");
      expect(created.inviteCode).toMatch(/^PLUTO-/);
      expect(created.members[0].id).toBe("you");
    });
  });

  describe("8: Multi-modal content ecosystem - restaurant reservations and culinary favorites", () => {
    it("resolves direct or search-backed reservation links for restaurant venues", () => {
      const ivy = MOCK_RESTAURANTS[0];
      const reservationUrl = getRestaurantReservationUrl(ivy);
      expect(reservationUrl).toBe(ivy.metadata.reservationUrl);

      const fakeRestaurant: ContentItem = {
        ...ivy,
        metadata: { ...ivy.metadata, reservationUrl: undefined, locationLabel: "SoHo, NY" },
      };
      const fallbackUrl = getRestaurantReservationUrl(fakeRestaurant);
      expect(fallbackUrl).toContain("google.com/search?q=");
      expect(fallbackUrl).toContain("reservation");
    });

    it("saves restaurant items in favorites and maintains type fidelity", () => {
      const store = makeStore();
      const restaurant = MOCK_RESTAURANTS[0];

      store.dispatch(toggleFavorite(restaurant));
      expect(store.getState().favorites.items).toHaveLength(1);
      expect(store.getState().favorites.items[0].item.type).toBe("restaurant");
      expect(store.getState().favorites.items[0].item.metadata.cuisine).toBe(restaurant.metadata.cuisine);
    });
  });
});

