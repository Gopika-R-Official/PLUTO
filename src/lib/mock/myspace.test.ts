import { describe, expect, it } from "vitest";
import { pickForSession } from "./myspace";

describe("My Space session picks", () => {
  it("filters by vibe and optional constraints", () => {
    const focusedHome = pickForSession({
      vibe: "focused",
      company: "alone",
      budget: "free",
      setting: "home",
    });
    expect(focusedHome.length).toBeGreaterThan(0);
    expect(focusedHome.every((item) => item.provenance === "mock")).toBe(true);
  });

  it("surprise returns a mixed labelled sample set", () => {
    const surprise = pickForSession({
      vibe: "surprise",
      company: null,
      budget: null,
      setting: null,
    });
    expect(surprise.length).toBeGreaterThan(3);
  });
});
