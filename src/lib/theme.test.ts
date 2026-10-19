import { describe, expect, it } from "vitest";
import { ATMOSPHERES, DEFAULT_ATMOSPHERE, resolveAtmosphere } from "./theme";

describe("theme atmosphere resolution", () => {
  it("defaults to design atmosphere when no interests are selected", () => {
    const atmosphere = resolveAtmosphere([]);
    expect(atmosphere.id).toBe(DEFAULT_ATMOSPHERE.id);
  });

  it("resolves to cinema when Movies is primary interest", () => {
    const atmosphere = resolveAtmosphere(["Movies", "Technology"]);
    expect(atmosphere.id).toBe("cinema");
    expect(atmosphere.accent).toBe(ATMOSPHERES.cinema.accent);
  });

  it("resolves to tech when Technology or Science is primary interest", () => {
    const atmosphere = resolveAtmosphere(["Technology", "Movies"]);
    expect(atmosphere.id).toBe("tech");
  });

  it("resolves to music when Music is primary interest", () => {
    const atmosphere = resolveAtmosphere(["Music"]);
    expect(atmosphere.id).toBe("music");
  });

  it("honors manualOverride regardless of selected interests", () => {
    const atmosphere = resolveAtmosphere(["Technology"], "travel");
    expect(atmosphere.id).toBe("travel");
  });
});
