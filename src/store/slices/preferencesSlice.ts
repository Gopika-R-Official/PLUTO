import { YOU } from "@/lib/constants";
import { clampBoost } from "@/lib/personalization";
import type { Interest, PreferencesState } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const defaultPreferences: PreferencesState = {
  displayName: YOU.name,
  interests: [],
  followedTopics: [],
  topicBoosts: {},
  openCounts: {},
  dismissedIds: [],
  onboardingComplete: false,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: defaultPreferences,
  reducers: {
    hydratePreferences(_state, action: PayloadAction<Partial<PreferencesState> | undefined>) {
      const payload = action.payload ?? {};
      const rawName = typeof payload.displayName === "string" ? payload.displayName.trim() : "";
      const displayName = rawName || YOU.name;
      const interests = Array.isArray(payload.interests) ? payload.interests : [];
      const isComplete = Boolean(payload.onboardingCompleted ?? payload.onboardingComplete);
      return {
        ...defaultPreferences,
        ...payload,
        displayName,
        interests,
        onboardingComplete: isComplete,
        onboardingCompleted: isComplete,
      };
    },
    setDisplayName(state, action: PayloadAction<string>) {
      state.displayName = action.payload.trim() || YOU.name;
    },
    setInterests(state, action: PayloadAction<Interest[]>) {
      state.interests = action.payload;
    },
    toggleInterest(state, action: PayloadAction<Interest>) {
      if (state.interests.includes(action.payload)) {
        state.interests = state.interests.filter((item) => item !== action.payload);
      } else {
        state.interests.push(action.payload);
      }
    },
    toggleFollowTopic(state, action: PayloadAction<Interest>) {
      if (state.followedTopics.includes(action.payload)) {
        state.followedTopics = state.followedTopics.filter((item) => item !== action.payload);
      } else {
        state.followedTopics.push(action.payload);
      }
    },
    completeOnboarding(
      state,
      action: PayloadAction<{ displayName?: string; interests: Interest[] } | Interest[]>,
    ) {
      if (Array.isArray(action.payload)) {
        state.interests = action.payload;
      } else {
        if (action.payload.displayName && action.payload.displayName.trim()) {
          state.displayName = action.payload.displayName.trim();
        }
        state.interests = action.payload.interests;
      }
      state.onboardingComplete = true;
      state.onboardingCompleted = true;
    },
    skipOnboarding(state) {
      state.onboardingComplete = true;
      state.onboardingCompleted = true;
    },
    recordOpen(state, action: PayloadAction<string>) {
      state.openCounts[action.payload] = (state.openCounts[action.payload] ?? 0) + 1;
    },
    dismissItem(state, action: PayloadAction<string>) {
      if (!state.dismissedIds.includes(action.payload)) {
        state.dismissedIds.push(action.payload);
      }
    },
    restoreItem(state, action: PayloadAction<string>) {
      state.dismissedIds = state.dismissedIds.filter((id) => id !== action.payload);
    },
    adjustTopic(state, action: PayloadAction<{ topic: string; delta: number }>) {
      const current = state.topicBoosts[action.payload.topic] ?? 0;
      state.topicBoosts[action.payload.topic] = clampBoost(current + action.payload.delta);
    },
    setAtmosphereOverride(state, action: PayloadAction<string | null>) {
      state.atmosphereOverride = action.payload;
    },
    resetPersonalization() {
      return { ...defaultPreferences, onboardingComplete: true, onboardingCompleted: true };
    },
  },
});

export const {
  hydratePreferences,
  setDisplayName,
  setInterests,
  toggleInterest,
  toggleFollowTopic,
  completeOnboarding,
  skipOnboarding,
  recordOpen,
  dismissItem,
  restoreItem,
  adjustTopic,
  setAtmosphereOverride,
  resetPersonalization,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
