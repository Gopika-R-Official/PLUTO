import { afterEach, describe, expect, it, vi } from "vitest";
import { makeStore } from "../index";
import { contentApi } from "./contentApi";

describe("content API states", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads news on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ items: [{ id: "n1", title: "Live" }], provenance: "live" }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      ),
    );
    const store = makeStore();
    const result = await store.dispatch(contentApi.endpoints.getNews.initiate({ topics: "Technology" }));
    expect(result.status).toBe("fulfilled");
    if (result.status === "fulfilled") {
      expect(result.data.items).toHaveLength(1);
      expect(result.data.provenance).toBe("live");
    }
  });

  it("surfaces an error state", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    const store = makeStore();
    const result = await store.dispatch(contentApi.endpoints.getNews.initiate({}));
    expect(result.status).toBe("rejected");
  });

  it("returns empty search groups", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            news: [],
            movies: [],
            social: [],
            newsProvenance: "mock",
            moviesProvenance: "mock",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      ),
    );
    const store = makeStore();
    const result = await store.dispatch(contentApi.endpoints.searchAll.initiate("zz"));
    expect(result.status).toBe("fulfilled");
    if (result.status === "fulfilled") {
      expect(result.data.news).toEqual([]);
    }
  });
});
