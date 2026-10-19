import { describe, expect, it } from "vitest";
import { makeStore } from "../index";
import { setTheme, toggleTheme } from "./themeSlice";

describe("theme", () => {
  it("toggles and sets theme", () => {
    const store = makeStore();
    expect(store.getState().theme.mode).toBe("light");
    store.dispatch(toggleTheme());
    expect(store.getState().theme.mode).toBe("dark");
    store.dispatch(setTheme("light"));
    expect(store.getState().theme.mode).toBe("light");
  });
});
