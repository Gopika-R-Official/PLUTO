import { describe, expect, it } from "vitest";
import { makeStore } from "../index";
import { completeOnboarding, resetPersonalization, setAtmosphereOverride, skipOnboarding } from "./preferencesSlice";

describe("preferences", () => {
  it("stores selected interests on onboarding complete", () => {
    const store = makeStore();
    store.dispatch(completeOnboarding(["Design", "Music"]));
    const state = store.getState().preferences;
    expect(state.onboardingComplete).toBe(true);
    expect(state.interests).toEqual(["Design", "Music"]);
  });

  it("allows skipping without forcing interests", () => {
    const store = makeStore();
    store.dispatch(skipOnboarding());
    expect(store.getState().preferences.onboardingComplete).toBe(true);
    expect(store.getState().preferences.interests).toEqual([]);
  });

  it("resets signals while keeping onboarding complete", () => {
    const store = makeStore();
    store.dispatch(completeOnboarding(["Travel"]));
    store.dispatch(resetPersonalization());
    const state = store.getState().preferences;
    expect(state.interests).toEqual([]);
    expect(state.onboardingComplete).toBe(true);
  });

  it("sets and updates atmosphere override", () => {
    const store = makeStore();
    store.dispatch(setAtmosphereOverride("cinema"));
    expect(store.getState().preferences.atmosphereOverride).toBe("cinema");
    store.dispatch(setAtmosphereOverride(null));
    expect(store.getState().preferences.atmosphereOverride).toBeNull();
  });
});
