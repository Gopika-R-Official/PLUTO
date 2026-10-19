import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits until typing settles before firing", () => {
    const spy = vi.fn();
    const run = debounce(spy, 350);
    run();
    run();
    run();
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(349);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
