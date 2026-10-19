import { INTERESTS } from "@/lib/constants";
import { fetchMovies, fetchMovieTrailerKey } from "@/lib/tmdb";
import type { Interest } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const trailerId = searchParams.get("trailerId");
  if (trailerId) {
    const trailerKey = await fetchMovieTrailerKey(trailerId);
    return NextResponse.json({ trailerKey });
  }

  const topics = (searchParams.get("topics") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part): part is Interest => INTERESTS.includes(part as Interest));

  const payload = await fetchMovies({
    query: searchParams.get("q") ?? undefined,
    interests: topics,
    trending: searchParams.get("trending") === "1",
  });
  return NextResponse.json(payload);
}
