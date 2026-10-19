import type { ContentItem, ContentResponse, FavoriteRecord, SearchResponse } from "@/lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface TrendingResponse {
  news: ContentItem[];
  movies: ContentItem[];
  newsProvenance: "live" | "mock";
  moviesProvenance: "live" | "mock";
  topics: string[];
  message?: string;
}

const getBaseUrl = () => {
  if (typeof window !== "undefined" && !process.env.VITEST) {
    return "/api";
  }
  return "http://localhost:3000/api";
};

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: (builder) => ({
    getNews: builder.query<ContentResponse, { topics?: string; q?: string }>({
      query: ({ topics, q }) => {
        const params = new URLSearchParams();
        if (topics) params.set("topics", topics);
        if (q) params.set("q", q);
        return `news?${params.toString()}`;
      },
    }),
    getMovies: builder.query<ContentResponse, { topics?: string; q?: string; trending?: boolean }>({
      query: ({ topics, q, trending }) => {
        const params = new URLSearchParams();
        if (topics) params.set("topics", topics);
        if (q) params.set("q", q);
        if (trending) params.set("trending", "1");
        return `movies?${params.toString()}`;
      },
    }),
    getTrending: builder.query<TrendingResponse, void>({
      query: () => "trending",
    }),
    searchAll: builder.query<SearchResponse, string>({
      query: (q) => `search?q=${encodeURIComponent(q)}`,
    }),
    getFavorites: builder.query<{ success: boolean; count: number; items: FavoriteRecord[] }, void>({
      query: () => "favorites",
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetTrendingQuery,
  useSearchAllQuery,
  useGetFavoritesQuery,
} = contentApi;
