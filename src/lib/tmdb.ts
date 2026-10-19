import { getCategoryFallbackImage } from "./images";
import { MOCK_MOVIES } from "./mock/movies";
import type { ContentItem, ContentResponse, Interest } from "./types";

const TMDB_IMAGE = "https://image.tmdb.org/t/p/w780";

interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
}

const GENRE_TO_INTEREST: Record<number, Interest> = {
  28: "Movies",
  12: "Travel",
  16: "Design",
  35: "Lifestyle",
  80: "Movies",
  99: "Science",
  18: "Movies",
  10751: "Lifestyle",
  14: "Movies",
  36: "Science",
  27: "Movies",
  10402: "Music",
  9648: "Movies",
  10749: "Lifestyle",
  878: "Science",
  10770: "Movies",
  53: "Movies",
  10752: "Movies",
  37: "Travel",
};

function credentials(): { bearer?: string; apiKey?: string } {
  return {
    bearer: process.env.TMDB_READ_ACCESS_TOKEN,
    apiKey: process.env.TMDB_API_KEY,
  };
}

export function hasTmdbCredentials(): boolean {
  const { bearer, apiKey } = credentials();
  return Boolean(bearer || apiKey);
}

function mapMovie(movie: TmdbMovie): ContentItem {
  const year = movie.release_date ? Number(movie.release_date.slice(0, 4)) : undefined;
  const categories = [
    "Movies" as Interest,
    ...((movie.genre_ids ?? []).map((id) => GENRE_TO_INTEREST[id]).filter(Boolean) as Interest[]),
  ];
  return {
    id: `movie-${movie.id}`,
    type: "movie",
    title: movie.title ?? movie.name ?? "Untitled",
    description: movie.overview ?? "",
    image: movie.poster_path
      ? `${TMDB_IMAGE}${movie.poster_path}`
      : movie.backdrop_path
        ? `${TMDB_IMAGE}${movie.backdrop_path}`
        : getCategoryFallbackImage("Movies", movie.title ?? movie.name),
    categories: [...new Set(categories)],
    source: "TMDB",
    url: `https://www.themoviedb.org/movie/${movie.id}`,
    publishedAt: movie.release_date ?? null,
    provenance: "live",
    metadata: {
      rating: movie.vote_average,
      year,
      genreIds: movie.genre_ids,
    },
  };
}

async function tmdbGet(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const { bearer, apiKey } = credentials();
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  if (apiKey && !bearer) url.searchParams.set("api_key", apiKey);

  const headers: HeadersInit = { Accept: "application/json" };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  const response = await fetch(url, { headers, next: { revalidate: 600 } });
  if (!response.ok) {
    throw new Error(`TMDB ${response.status}`);
  }
  return response.json();
}

function filterByInterests(items: ContentItem[], interests: Interest[]): ContentItem[] {
  if (interests.length === 0) return items;
  const matched = items.filter((item) =>
    item.categories.some((category) => interests.includes(category as Interest)),
  );
  return matched.length >= 4 ? matched : items;
}

export async function fetchMovies(options: {
  query?: string;
  interests?: Interest[];
  trending?: boolean;
}): Promise<ContentResponse> {
  if (!hasTmdbCredentials()) {
    let items = MOCK_MOVIES;
    if (options.query) {
      const q = options.query.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
      );
    } else if (options.interests?.length) {
      items = filterByInterests(items, options.interests);
    }
    return {
      items,
      provenance: "mock",
      message: "Showing sample titles. Add TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY for live TMDB data.",
    };
  }

  try {
    const data = (await (options.query
      ? tmdbGet("/search/movie", { query: options.query, include_adult: "false" })
      : options.trending
        ? tmdbGet("/trending/movie/week")
        : tmdbGet("/discover/movie", { sort_by: "popularity.desc", include_adult: "false" }))) as {
      results?: TmdbMovie[];
    };

    let items = (data.results ?? []).slice(0, 16).map(mapMovie);
    if (!options.query && options.interests?.length) {
      items = filterByInterests(items, options.interests);
    }
    return { items, provenance: "live" };
  } catch {
    return {
      items: MOCK_MOVIES,
      provenance: "mock",
      message: "TMDB request failed. Showing sample titles.",
    };
  }
}

export async function fetchMovieTrailerKey(movieId: string | number): Promise<string | null> {
  const numericId = String(movieId).replace(/^movie-/, "");

  // Check known curated archive in MOCK_MOVIES first
  const fallback = MOCK_MOVIES.find(
    (m) => m.id === String(movieId) || m.id === `movie-${numericId}`,
  );
  if (fallback?.metadata.trailerKey) {
    return fallback.metadata.trailerKey;
  }

  if (!hasTmdbCredentials()) {
    return null;
  }

  try {
    const data = (await tmdbGet(`/movie/${numericId}/videos`)) as {
      results?: Array<{
        key: string;
        site: string;
        type: string;
        official?: boolean;
      }>;
    };
    const videos = data.results ?? [];
    const ytTrailers = videos.filter((v) => v.site === "YouTube" && v.type === "Trailer");
    const officialTrailer = ytTrailers.find((v) => v.official) ?? ytTrailers[0];
    if (officialTrailer) {
      return officialTrailer.key;
    }
    const anyYt = videos.find((v) => v.site === "YouTube");
    return anyYt?.key ?? null;
  } catch {
    return null;
  }
}
