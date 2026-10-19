import { MOCK_SOCIAL } from "@/lib/mock/social";
import { fetchNews } from "@/lib/news";
import { matchesQuery } from "@/lib/personalization";
import { fetchMovies } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({
      news: [],
      movies: [],
      social: [],
      newsProvenance: "live",
      moviesProvenance: "live",
    });
  }

  const [news, movies] = await Promise.all([
    fetchNews({ query: q }),
    fetchMovies({ query: q }),
  ]);

  return NextResponse.json({
    news: news.items,
    movies: movies.items,
    social: MOCK_SOCIAL.filter((item) => matchesQuery(item, q)),
    newsProvenance: news.provenance,
    moviesProvenance: movies.provenance,
    message: [news.message, movies.message].filter(Boolean).join(" "),
  });
}
