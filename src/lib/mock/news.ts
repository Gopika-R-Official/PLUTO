import type { ContentItem } from "../types";

export const MOCK_NEWS: ContentItem[] = [
  {
    id: "news-mock-1",
    type: "news",
    title: "Bengaluru’s deep-tech studios are shipping quieter AI products",
    description:
      "Founders are trading launch-week spectacle for smaller models, clearer evals, and products that survive a Monday standup.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
    categories: ["Technology", "Business"],
    source: "Rest of World",
    url: "https://restofworld.org",
    publishedAt: "2026-10-16T08:00:00.000Z",
    provenance: "mock",
    metadata: { author: "N. Iyer" },
  },
  {
    id: "news-mock-2",
    type: "news",
    title: "Why climate labs still need analog notebooks",
    description:
      "A field station in the Western Ghats is pairing satellite feeds with paper logs — because batteries fail and weather does not wait.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    categories: ["Science", "Lifestyle"],
    source: "Nature Journal",
    url: "https://www.nature.com",
    publishedAt: "2026-10-15T11:20:00.000Z",
    provenance: "mock",
    metadata: { author: "S. Menon" },
  },
  {
    id: "news-mock-3",
    type: "news",
    title: "Markets watch the rupee, but designers watch the receipt",
    description:
      "A quieter week in finance still changed how consumer apps talk about money — fewer badges, more honest timestamps.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80",
    categories: ["Finance", "Design"],
    source: "Pluto Brief (sample)",
    // Intentionally null to test honest unavailable state
    url: null,
    publishedAt: "2026-10-14T06:40:00.000Z",
    provenance: "mock",
    metadata: { author: "A. Kapoor" },
  },
  {
    id: "news-mock-4",
    type: "news",
    title: "Indian independent cinema finds its weekend audience again",
    description:
      "Smaller theatres in Pune and Kochi are selling out Tuesday previews — the algorithm did not predict the queue.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
    categories: ["Movies", "Lifestyle"],
    source: "BBC Culture",
    url: "https://www.bbc.com/culture",
    publishedAt: "2026-10-13T18:10:00.000Z",
    provenance: "mock",
    metadata: { author: "R. Das" },
  },
  {
    id: "news-mock-5",
    type: "news",
    title: "A new generation of cricket analytics is built for radio, not Twitter",
    description:
      "Stat crews are writing for the ear: fewer heat maps, more sentences a commentator can actually say.",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1400&q=80",
    categories: ["Sports", "Technology"],
    source: "Pluto Brief (sample)",
    // Intentionally null to test honest unavailable state
    url: null,
    publishedAt: "2026-10-12T09:00:00.000Z",
    provenance: "mock",
    metadata: { author: "K. Singh" },
  },
  {
    id: "news-mock-6",
    type: "news",
    title: "Night trains, slow travel, and the return of the long weekend",
    description:
      "Planners in India are booking sleeper routes again — not as nostalgia, but as a cheaper way to arrive already rested.",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1400&q=80",
    categories: ["Travel", "Lifestyle"],
    source: "BBC Travel",
    url: "https://www.bbc.com/travel",
    publishedAt: "2026-10-11T14:30:00.000Z",
    provenance: "mock",
    metadata: { author: "M. Ferns" },
  },
  {
    id: "news-mock-7",
    type: "news",
    title: "Studio musicians are scoring game worlds with ragas, not tropes",
    description:
      "Interactive scores from Mumbai rooms are treating ragas as systems — motifs that change when the player waits.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80",
    categories: ["Music", "Gaming"],
    source: "The Verge",
    url: "https://www.theverge.com",
    publishedAt: "2026-10-10T16:05:00.000Z",
    provenance: "mock",
    metadata: { author: "P. Nair" },
  },
  {
    id: "news-mock-8",
    type: "news",
    title: "The best product teams still argue about typography",
    description:
      "A design lead in Koramangala on why a 2px tracking change survived three roadmap cuts.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80",
    categories: ["Design", "Technology"],
    source: "A List Apart",
    url: "https://alistapart.com",
    publishedAt: "2026-10-09T10:15:00.000Z",
    provenance: "mock",
    metadata: { author: "L. Rao" },
  },
];
