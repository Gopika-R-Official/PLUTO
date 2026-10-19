import { MOCK_NEWS } from "@/lib/mock/news";
import { fetchNewsFromRss } from "@/lib/rss";
import { fetchMovies } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET() {
  const [newsResult, movies] = await Promise.allSettled([
    fetchNewsFromRss(["Technology", "Business", "Sports", "Movies"]),
    fetchMovies({ trending: true }),
  ]);

  const newsItems =
    newsResult.status === "fulfilled" && newsResult.value.length > 0
      ? newsResult.value.slice(0, 8)
      : MOCK_NEWS.slice(0, 6);
  const newsProvenance =
    newsResult.status === "fulfilled" && newsResult.value.length > 0 ? "live" : "mock";

  const moviePayload =
    movies.status === "fulfilled"
      ? movies.value
      : { items: [], provenance: "mock" as const, message: "Movies unavailable." };

  const topics = [
    ...newsItems.flatMap((item) => item.categories),
    ...moviePayload.items.flatMap((item) => item.categories),
  ];
  const counts = topics.reduce<Record<string, number>>((acc, topic) => {
    acc[topic] = (acc[topic] ?? 0) + 1;
    return acc;
  }, {});
  const trendingTopics = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 8);

  return NextResponse.json({
    news: newsItems,
    movies: moviePayload.items.slice(0, 10),
    newsProvenance,
    moviesProvenance: moviePayload.provenance,
    topics: trendingTopics,
    message: moviePayload.message,
  });
}
