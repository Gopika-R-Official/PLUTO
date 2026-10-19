import { describe, expect, it } from "vitest";
import { parseRssItems } from "./rss";

const SAMPLE = `
<rss><channel>
<item>
<title>Quiet chips</title>
<link>https://example.com/a</link>
<description>A semiconductor story</description>
<pubDate>Wed, 15 Oct 2026 10:00:00 GMT</pubDate>
<guid>abc-1</guid>
</item>
</channel></rss>
`;

describe("rss parser", () => {
  it("normalizes RSS items into the shared content model", () => {
    const items = parseRssItems(SAMPLE, "Technology", 4);
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe("news");
    expect(items[0].title).toBe("Quiet chips");
    expect(items[0].provenance).toBe("live");
    expect(items[0].url).toBe("https://example.com/a");
  });

  it("generates unique IDs for items that share long URL prefixes", () => {
    const multiItemXml = `
<rss><channel>
<item>
<title>Story 1</title>
<link>https://www.bbc.co.uk/news/articles/c04j33q5489o</link>
<guid>https://www.bbc.co.uk/news/articles/c04j33q5489o</guid>
</item>
<item>
<title>Story 2</title>
<link>https://www.bbc.co.uk/news/articles/c9876543210x</link>
<guid>https://www.bbc.co.uk/news/articles/c9876543210x</guid>
</item>
</channel></rss>
    `;
    const items = parseRssItems(multiItemXml, "Technology", 4);
    expect(items).toHaveLength(2);
    expect(items[0].id).not.toBe(items[1].id);
  });
});
