"use client";

import { MovieCard } from "@/components/content/MovieCard";
import { NewsCard } from "@/components/content/NewsCard";
import { SocialCard } from "@/components/content/SocialCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProvenanceNote } from "@/components/ui/ProvenanceNote";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useSearchAllQuery } from "@/store/api/contentApi";
import { Film, Globe2, MessageSquare, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const FILTERS = ["all", "news", "movies", "social"] as const;

const INITIAL_PAGE_SIZE = 6;
const PAGE_STEP = 4;

export function SearchView() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const { data, isFetching, isError, refetch } = useSearchAllQuery(q, {
    skip: q.trim().length < 2,
  });

  const [visibleNewsCount, setVisibleNewsCount] = useState(INITIAL_PAGE_SIZE);
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(INITIAL_PAGE_SIZE);
  const [visibleSocialCount, setVisibleSocialCount] = useState(INITIAL_PAGE_SIZE);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  // Reset pagination whenever search query or category filter changes
  const [prevQueryKey, setPrevQueryKey] = useState(`${q}-${filter}`);
  const currentQueryKey = `${q}-${filter}`;
  if (prevQueryKey !== currentQueryKey) {
    setPrevQueryKey(currentQueryKey);
    setVisibleNewsCount(INITIAL_PAGE_SIZE);
    setVisibleMoviesCount(INITIAL_PAGE_SIZE);
    setVisibleSocialCount(INITIAL_PAGE_SIZE);
  }

  const news = useMemo(() => data?.news ?? [], [data?.news]);
  const movies = useMemo(() => data?.movies ?? [], [data?.movies]);
  const social = useMemo(() => data?.social ?? [], [data?.social]);
  const total = news.length + movies.length + social.length;

  const visibleNews = useMemo(() => news.slice(0, visibleNewsCount), [news, visibleNewsCount]);
  const hasMoreNews = visibleNews.length < news.length;

  const visibleMovies = useMemo(() => movies.slice(0, visibleMoviesCount), [movies, visibleMoviesCount]);
  const hasMoreMovies = visibleMovies.length < movies.length;

  const visibleSocial = useMemo(() => social.slice(0, visibleSocialCount), [social, visibleSocialCount]);
  const hasMoreSocial = visibleSocial.length < social.length;

  const handleLoadMore = (section: "news" | "movies" | "social") => {
    setLoadingSection(section);
    setTimeout(() => {
      if (section === "news") {
        setVisibleNewsCount((prev) => Math.min(prev + PAGE_STEP, news.length));
      } else if (section === "movies") {
        setVisibleMoviesCount((prev) => Math.min(prev + PAGE_STEP, movies.length));
      } else {
        setVisibleSocialCount((prev) => Math.min(prev + PAGE_STEP, social.length));
      }
      setLoadingSection(null);
    }, 200);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Search Header */}
      <header className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-sm sm:p-10 card-tactile">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-blue-500" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-blue-400">
                <Search className="h-3.5 w-3.5" />
                INDEX SEARCH · UNIVERSAL DISCOVERY
              </span>
              {q && (
                <span className="font-mono text-xs text-muted">
                  Queried across live broadcast & TMDB
                </span>
              )}
            </div>

            <h1 className="editorial mt-3 text-4xl font-bold tracking-tight text-fg sm:text-6xl">
              {q ? `Results for “${q}”` : "Search the Pluto universe"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Query journalism archives, film festival catalogues, and community discussions.
              Fast debounced search with live results.
            </p>
          </div>

          {q && (
            <div className="rounded-2xl border border-border bg-card-strong/60 px-4 py-2 font-mono text-xs text-muted">
              {total} total items found
            </div>
          )}
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count =
            item === "all"
              ? total
              : item === "news"
              ? news.length
              : item === "movies"
              ? movies.length
              : social.length;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                filter === item
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                  : "bg-chip text-muted hover:text-fg hover:bg-chip-hover"
              }`}
            >
              {item === "all" ? "All Formats" : item}
              {data && total > 0 && <span className="ml-1.5 opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {q.trim().length < 2 && (
        <EmptyState
          title="Type at least two characters"
          body="Use the search bar in the header to search across journalism dispatches, TMDB films, and community thoughts."
        />
      )}

      {isFetching && (
        <div className="grid gap-5 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {isError && (
        <EmptyState
          title="Search query failed"
          body="One of the external data aggregators did not respond."
          action={
            <button
              type="button"
              className="rounded-full bg-ink text-paper dark:bg-paper dark:text-ink px-5 py-2.5 text-sm font-semibold shadow-md"
              onClick={() => refetch()}
            >
              Retry Search
            </button>
          }
        />
      )}

      {!isFetching && data && total === 0 && q.trim().length >= 2 && (
        <EmptyState
          title={`No results matching “${q}”`}
          body="Try searching for broader keywords like 'tech', 'cinema', 'climate', 'festival', or film titles."
        />
      )}

      {data && total > 0 && (
        <div className="space-y-12">
          {/* NEWS RESULTS */}
          {(filter === "all" || filter === "news") && news.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/15 text-blue-500">
                    <Globe2 className="h-4 w-4" />
                  </span>
                  <h2 className="editorial text-2xl font-bold">News & Dispatches ({news.length})</h2>
                </div>
                <ProvenanceNote provenance={data.newsProvenance} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {visibleNews.map((item) => (
                  <NewsCard key={item.id} item={item} variant="editorial" />
                ))}
              </div>

              {hasMoreNews && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70">
                  <span className="font-mono text-xs text-muted">
                    Showing {visibleNews.length} of {news.length} news dispatches
                  </span>
                  <button
                    type="button"
                    disabled={loadingSection === "news"}
                    onClick={() => handleLoadMore("news")}
                    className="rounded-full border border-border bg-card-strong px-5 py-2 text-xs font-semibold text-fg transition hover:bg-fg hover:text-bg disabled:opacity-50"
                  >
                    {loadingSection === "news" ? "Loading dispatches..." : "Load More News"}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* MOVIES RESULTS */}
          {(filter === "all" || filter === "movies") && movies.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                    <Film className="h-4 w-4" />
                  </span>
                  <h2 className="editorial text-2xl font-bold">Films & Screenings ({movies.length})</h2>
                </div>
                <ProvenanceNote provenance={data.moviesProvenance} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {visibleMovies.map((item) => (
                  <MovieCard key={item.id} item={item} variant="poster" />
                ))}
              </div>

              {hasMoreMovies && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70">
                  <span className="font-mono text-xs text-muted">
                    Showing {visibleMovies.length} of {movies.length} films
                  </span>
                  <button
                    type="button"
                    disabled={loadingSection === "movies"}
                    onClick={() => handleLoadMore("movies")}
                    className="rounded-full border border-border bg-card-strong px-5 py-2 text-xs font-semibold text-fg transition hover:bg-fg hover:text-bg disabled:opacity-50"
                  >
                    {loadingSection === "movies" ? "Loading films..." : "Load More Films"}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* SOCIAL / VOICES RESULTS */}
          {(filter === "all" || filter === "social") && social.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-purple-500/15 text-purple-500">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <h2 className="editorial text-2xl font-bold">Community Voices ({social.length})</h2>
                </div>
                <ProvenanceNote provenance="mock" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {visibleSocial.map((item) => (
                  <SocialCard key={item.id} item={item} />
                ))}
              </div>

              {hasMoreSocial && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70">
                  <span className="font-mono text-xs text-muted">
                    Showing {visibleSocial.length} of {social.length} discussions
                  </span>
                  <button
                    type="button"
                    disabled={loadingSection === "social"}
                    onClick={() => handleLoadMore("social")}
                    className="rounded-full border border-border bg-card-strong px-5 py-2 text-xs font-semibold text-fg transition hover:bg-fg hover:text-bg disabled:opacity-50"
                  >
                    {loadingSection === "social" ? "Loading discussions..." : "Load More Discussions"}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
