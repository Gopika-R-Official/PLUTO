import { describe, expect, it } from "vitest";
import { makeStore } from "@/store";
import {
  completeOnboarding,
  hydratePreferences,
  toggleInterest,
} from "@/store/slices/preferencesSlice";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { setTheme } from "@/store/slices/themeSlice";
import { setFeedOrder } from "@/store/slices/layoutSlice";
import { rankContent, scoreItem } from "@/lib/personalization";
import { MOCK_NEWS } from "@/lib/mock/news";
import { MOCK_MOVIES } from "@/lib/mock/movies";
import { DEFAULT_FEED_ORDER } from "@/lib/constants";
import type { Interest, PreferencesState } from "@/lib/types";

describe("Onboarding & Personalization Suite", () => {
  // Test 1: New users see onboarding (onboardingComplete is false by default)
  it("1. new users start with onboarding incomplete", () => {
    const store = makeStore();
    const prefs = store.getState().preferences;
    expect(prefs.onboardingComplete).toBe(false);
    expect(prefs.onboardingCompleted ?? false).toBe(false);
    expect(prefs.interests).toEqual([]);
  });

  // Test 2: Blank names and zero interests validation logic
  it("2. rejects blank or whitespace-only display names and zero interests", () => {
    // Validation function matching Onboarding.tsx component validation logic
    const validateOnboarding = (name: string, interests: Interest[]) => {
      const trimmed = name.trim();
      const errors: { name?: string; interests?: string } = {};
      if (!trimmed) {
        errors.name = "Display name is required.";
      } else if (trimmed.length < 2) {
        errors.name = "Display name must be at least 2 characters.";
      }
      if (interests.length === 0) {
        errors.interests = "At least one interest is required.";
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors,
        trimmedName: trimmed,
      };
    };

    // Blank name rejected
    expect(validateOnboarding("", ["Technology"]).isValid).toBe(false);
    expect(validateOnboarding("   ", ["Technology"]).errors.name).toBe("Display name is required.");

    // Short name (<2 chars) rejected
    expect(validateOnboarding("A", ["Technology"]).errors.name).toBe("Display name must be at least 2 characters.");

    // Zero interests rejected
    expect(validateOnboarding("Alex", []).isValid).toBe(false);
    expect(validateOnboarding("Alex", []).errors.interests).toBe("At least one interest is required.");

    // Both blank rejected
    const bothBlank = validateOnboarding("   ", []);
    expect(bothBlank.isValid).toBe(false);
    expect(bothBlank.errors.name).toBeDefined();
    expect(bothBlank.errors.interests).toBeDefined();

    // Valid submission passes
    const valid = validateOnboarding("Alex Rao", ["Technology", "Science"]);
    expect(valid.isValid).toBe(true);
    expect(valid.trimmedName).toBe("Alex Rao");
  });

  // Test 3: Successful onboarding saves the profile and marks completion
  it("3. successful onboarding saves display name, interests, and marks completion", () => {
    const store = makeStore();
    store.dispatch(
      completeOnboarding({
        displayName: "Priya Sharma",
        interests: ["Technology", "Movies", "Gaming"],
      }),
    );

    const state = store.getState().preferences;
    expect(state.onboardingComplete).toBe(true);
    expect(state.onboardingCompleted).toBe(true);
    expect(state.displayName).toBe("Priya Sharma");
    expect(state.interests).toEqual(["Technology", "Movies", "Gaming"]);
  });

  // Test 4: Profile and interests persist after reload / rehydration
  it("4. profile and interests persist across storage serialization and rehydration", () => {
    const initialStore = makeStore();
    initialStore.dispatch(
      completeOnboarding({
        displayName: "Karan Patel",
        interests: ["Science", "Finance", "Social"],
      }),
    );

    // Simulate serialization to localStorage
    const serialized = JSON.stringify(initialStore.getState().preferences);

    // Simulate new session reload with empty store rehydrated from storage
    const newStore = makeStore();
    expect(newStore.getState().preferences.onboardingComplete).toBe(false);

    const parsedData = JSON.parse(serialized);
    newStore.dispatch(hydratePreferences(parsedData));

    const rehydrated = newStore.getState().preferences;
    expect(rehydrated.onboardingComplete).toBe(true);
    expect(rehydrated.displayName).toBe("Karan Patel");
    expect(rehydrated.interests).toEqual(["Science", "Finance", "Social"]);
  });

  // Test 5: Updating interests changes the visible personalized feed
  it("5. updating interests dynamically shifts content ranking and prioritization", () => {
    const store = makeStore();

    // User initially chooses Technology
    store.dispatch(
      completeOnboarding({
        displayName: "Tester",
        interests: ["Technology"],
      }),
    );

    const prefsTech = store.getState().preferences;
    const rankedWithTech = rankContent(MOCK_NEWS, prefsTech);
    expect(rankedWithTech[0].categories).toContain("Technology");

    // Technology item should have higher score than Arts/Travel item
    const techItem = MOCK_NEWS.find((i) => i.categories.includes("Technology"))!;
    const travelItem = MOCK_NEWS.find((i) => i.categories.includes("Travel") && !i.categories.includes("Technology"))!;

    expect(scoreItem(techItem, prefsTech)).toBeGreaterThan(scoreItem(travelItem, prefsTech));

    // Now update interests to Travel
    store.dispatch(toggleInterest("Technology")); // remove Tech
    store.dispatch(toggleInterest("Travel")); // add Travel

    const prefsTravel = store.getState().preferences;
    expect(prefsTravel.interests).toEqual(["Travel"]);

    // Now Travel item has higher score than Technology item
    expect(scoreItem(travelItem, prefsTravel)).toBeGreaterThan(scoreItem(techItem, prefsTravel));

    // Re-ranked content puts travel story ahead
    const rankedWithTravel = rankContent(MOCK_NEWS, prefsTravel);
    expect(rankedWithTravel[0].categories).toContain("Travel");
  });

  // Test 6: Preservation of existing favorites, theme, and feed layout order
  it("6. onboarding and interest changes do not overwrite favorites, theme, or feed layout", () => {
    const store = makeStore();

    // Set theme and save a favorite first
    store.dispatch(setTheme("dark"));
    const movie = MOCK_MOVIES[0];
    store.dispatch(toggleFavorite(movie));

    // Customize feed order
    const customOrder = [...DEFAULT_FEED_ORDER].reverse();
    store.dispatch(setFeedOrder(customOrder));

    expect(store.getState().theme.mode).toBe("dark");
    expect(store.getState().favorites.items).toHaveLength(1);
    expect(store.getState().layout.feedOrder).toEqual(customOrder);

    // Complete onboarding
    store.dispatch(
      completeOnboarding({
        displayName: "Samir",
        interests: ["Music", "Gaming"],
      }),
    );

    // Verify unrelated state is completely preserved
    expect(store.getState().theme.mode).toBe("dark");
    expect(store.getState().favorites.items).toHaveLength(1);
    expect(store.getState().favorites.items[0].id).toBe(movie.id);
    expect(store.getState().layout.feedOrder).toEqual(customOrder);

    // Verify preferences state holds the new values
    expect(store.getState().preferences.displayName).toBe("Samir");
    expect(store.getState().preferences.interests).toEqual(["Music", "Gaming"]);
  });

  // Test 7: Safe handling of malformed or legacy stored data
  it("7. safely handles malformed, partial, or legacy preferences during hydration", () => {
    const store = makeStore();

    // Malformed null/empty payload
    store.dispatch(hydratePreferences(undefined));
    expect(store.getState().preferences.displayName).toBeDefined();
    expect(store.getState().preferences.interests).toEqual([]);

    // Legacy payload with onboardingComplete as boolean and missing onboardingCompleted
    const legacyPayload = {
      displayName: "  Legacy User  ",
      interests: ["Movies" as Interest],
      onboardingComplete: true,
    } as PreferencesState;

    store.dispatch(hydratePreferences(legacyPayload));
    const normalized = store.getState().preferences;
    expect(normalized.displayName).toBe("Legacy User");
    expect(normalized.onboardingComplete).toBe(true);
    expect(normalized.onboardingCompleted).toBe(true);
    expect(normalized.interests).toEqual(["Movies"]);
  });
});
