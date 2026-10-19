"use client";

import { ContentCard } from "@/components/content/ContentCard";
import { MovieCard } from "@/components/content/MovieCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProvenanceNote } from "@/components/ui/ProvenanceNote";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_MOVIES } from "@/lib/mock/movies";
import { MOCK_NEWS } from "@/lib/mock/news";
import { toast } from "@/components/ui/Toast";
import { useGetTrendingQuery } from "@/store/api/contentApi";
import { Film, Flame, Globe2, Newspaper, Radio, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

type TrendingTab = "all" | "cinema" | "news";

const INITIAL_NEWS_COUNT = 8;
const NEWS_PAGE_STEP = 4;
const INITIAL_MOVIES_COUNT = 8;
const MOVIES_PAGE_STEP = 4;

export function TrendingView() {
  const { data, isLoading, isError, refetch } = useGetTrendingQuery();
  const [activeTab, setActiveTab] = useState<TrendingTab>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "movies" || tab === "cinema") return "cinema";
      if (tab === "news") return "news";
    }
    return "all";
  });
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [visibleNewsCount, setVisibleNewsCount] = useState(INITIAL_NEWS_COUNT);
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(INITIAL_MOVIES_COUNT);
  const [isLoadingMoreNews, setIsLoadingMoreNews] = useState(false);
  const [isLoadingMoreMovies, setIsLoadingMoreMovies] = useState(false);

  const [prevFilterKey, setPrevFilterKey] = useState(`${activeTab}-${selectedTopic ?? ""}`);
  const currentFilterKey = `${activeTab}-${selectedTopic ?? ""}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleNewsCount(INITIAL_NEWS_COUNT);
    setVisibleMoviesCount(INITIAL_MOVIES_COUNT);
  }

  const news = useMemo(() => {
    const raw = data?.news && data.news.length > 0 ? data.news : MOCK_NEWS;
    const seen = new Set<string>();
    const list = raw.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    if (!selectedTopic) return list;
    return list.filter((item) => item.categories.includes(selectedTopic));
  }, [data, selectedTopic]);

  const movies = useMemo(() => {
    const raw = data?.movies && data.movies.length > 0 ? data.movies : MOCK_MOVIES;
    const seen = new Set<string>();
    const list = raw.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    if (!selectedTopic) return list;
    return list.filter((item) => item.categories.includes(selectedTopic));
  }, [data, selectedTopic]);

  const topSpotlight =
    (activeTab === "cinema" ? movies[0] : (movies[0] ?? news[0])) ?? MOCK_MOVIES[0];

  const visibleMovies = useMemo(
    () => movies.slice(1, visibleMoviesCount + 1),
    [movies, visibleMoviesCount],
  );
  const totalMovies = Math.max(0, movies.length - 1);
  const hasMoreMovies = visibleMovies.length < totalMovies;

  const visibleNews = useMemo(
    () => news.slice(0, visibleNewsCount),
    [news, visibleNewsCount],
  );
  const hasMoreNews = visibleNews.length < news.length;

  const handleLoadMoreMovies = () => {
    setIsLoadingMoreMovies(true);
    setTimeout(() => {
      setVisibleMoviesCount((prev) => Math.min(prev + MOVIES_PAGE_STEP, totalMovies));
      setIsLoadingMoreMovies(false);
    }, 200);
  };

  const handleLoadMoreNews = () => {
    setIsLoadingMoreNews(true);
    setTimeout(() => {
      setVisibleNewsCount((prev) => Math.min(prev + NEWS_PAGE_STEP, news.length));
      setIsLoadingMoreNews(false);
    }, 200);
  };

  const openDispatch = (item: { url?: string | null }) => {
    if (item.url && item.url.startsWith("http")) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      toast.info("Original publisher link is currently unavailable for this item.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Header with High-Velocity Pulse */}
      <header className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-sm sm:p-10 card-tactile">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-amber-500" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-red-600" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-red-500 dark:text-red-400">
                <Flame className="h-3.5 w-3.5 fill-current" />
                {activeTab === "cinema"
                  ? "CINEMA PULSE · BOX OFFICE VELOCITY"
                  : activeTab === "news"
                  ? "GLOBAL WIRE · 24H NEWS"
                  : "GLOBAL PULSE · 24H VELOCITY"}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
                <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                {activeTab === "cinema"
                  ? "Verified TMDB Box Office Aggregators"
                  : "Live BBC & TMDB Aggregators"}
              </span>
            </div>

            <h1 className="editorial mt-3 text-4xl font-bold tracking-tight text-fg sm:text-6xl">
              {activeTab === "cinema"
                ? "Box Office & Cinema Velocity"
                : activeTab === "news"
                ? "Breaking Headlines & Wire"
                : "What is moving right now"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {activeTab === "cinema"
                ? "Real-time box office velocity tracking from TMDB and international premiere circuits. Spotlighting global debuts, trailers, and ticket bookings."
                : activeTab === "news"
                ? "Real-time investigative journalism and global dispatches from verified broadcast networks."
                : "Real-time velocity tracking from verified broadcast networks and box office trackers. Spotlighting top global conversation threads without synthetic algorithms."}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card-strong/60 p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === "all"
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                  : "text-muted hover:text-fg"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              All Velocity
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cinema")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === "cinema"
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                  : "text-muted hover:text-fg"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              Box Office ({movies.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("news")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === "news"
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                  : "text-muted hover:text-fg"
              }`}
            >
              <Newspaper className="h-3.5 w-3.5" />
              Headlines ({news.length})
            </button>
          </div>
        </div>
      </header>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <CardSkeleton />
          <div className="grid gap-5 md:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <EmptyState
          title="Trending feeds unavailable"
          body="The live BBC and TMDB aggregators could not be reached right now."
          action={
            <button
              type="button"
              className="rounded-full bg-ink text-paper dark:bg-paper dark:text-ink px-5 py-2.5 text-sm font-semibold shadow-md"
              onClick={() => refetch()}
            >
              Retry Connection
            </button>
          }
        />
      )}

      {data && (
        <>
          {/* Topic Pills Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted">Topic Filter:</span>
            <button
              type="button"
              onClick={() => setSelectedTopic(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedTopic === null
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                  : "bg-chip text-muted hover:text-fg"
              }`}
            >
              All Topics
            </button>
            {data.topics.map((topic) => {
              const active = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(active ? null : topic)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                      : "bg-chip text-muted hover:text-fg"
                  }`}
                >
                  #{topic}
                </button>
              );
            })}
          </div>

          {/* #1 SPOTLIGHT HERO */}
          {topSpotlight && (activeTab === "all" || activeTab === "cinema") && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-amber-500 uppercase">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  #01 Trending Worldwide
                </span>
                <span className="font-mono text-xs text-muted">Rank 1 of {movies.length + news.length}</span>
              </div>
              <ContentCard item={topSpotlight} variant="spotlight" />
            </section>
          )}

          {/* CINEMA BOX OFFICE LEADERBOARD */}
          {(activeTab === "all" || activeTab === "cinema") && movies.length > 1 && (
            <section className="space-y-5 rounded-[2.2rem] border border-border bg-card p-6 sm:p-8 card-tactile">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/15 text-amber-500 font-bold">
                    <Film className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="editorial text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                      Box Office Leaderboard
                    </h2>
                    <p className="text-xs text-muted">TMDB global box office rank & critical reception</p>
                  </div>
                </div>
                <ProvenanceNote provenance={data.moviesProvenance} message={data.message} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {visibleMovies.map((movie, index) => (
                  <div key={movie.id} className="relative group">
                    <div className="absolute -left-2 -top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-xs font-bold shadow-md">
                      #{index + 2 < 10 ? `0${index + 2}` : index + 2}
                    </div>
                    <MovieCard item={movie} variant="poster" />
                  </div>
                ))}
              </div>

              {hasMoreMovies && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/70">
                  <span className="font-mono text-xs text-muted">
                    Showing {visibleMovies.length} of {totalMovies} box office titles
                  </span>
                  <button
                    type="button"
                    disabled={isLoadingMoreMovies}
                    onClick={handleLoadMoreMovies}
                    className="rounded-full border border-border bg-card-strong px-5 py-2 text-xs font-semibold text-fg transition hover:bg-fg hover:text-bg disabled:opacity-50"
                  >
                    {isLoadingMoreMovies ? "Loading more titles..." : "Load More Box Office"}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* GLOBAL HEADLINES WIRE LEADERBOARD */}
          {(activeTab === "all" || activeTab === "news") && news.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/15 text-blue-500 font-bold">
                    <Globe2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="editorial text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                      The Live News Wire
                    </h2>
                    <p className="text-xs text-muted">Ranked editorial dispatches from BBC World</p>
                  </div>
                </div>
                <ProvenanceNote provenance={data.newsProvenance} />
              </div>

              <div className="space-y-4">
                {visibleNews.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-fg/30 hover:shadow-md card-tactile"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <span className="font-mono text-2xl font-bold text-muted/40 group-hover:text-fg transition-colors">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <span className="font-semibold text-fg">{item.source}</span>
                          <span>·</span>
                          <span>{item.categories[0] ?? "World"}</span>
                        </div>
                        <h3
                          onClick={() => openDispatch(item)}
                          className="editorial mt-1 text-lg sm:text-xl font-bold text-fg group-hover:text-blue-500 transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted line-clamp-1 max-w-2xl">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openDispatch(item)}
                        className="rounded-full border border-border bg-card-strong px-4 py-1.5 text-xs font-semibold text-fg transition hover:bg-fg hover:text-bg"
                      >
                        Read Dispatch →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreNews && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/70">
                  <span className="font-mono text-xs text-muted">
                    Showing {visibleNews.length} of {news.length} global dispatches
                  </span>
                  <button
                    type="button"
                    disabled={isLoadingMoreNews}
                    onClick={handleLoadMoreNews}
                    className="rounded-full border border-border bg-card-strong px-5 py-2 text-xs font-semibold text-fg transition hover:bg-fg hover:text-bg disabled:opacity-50"
                  >
                    {isLoadingMoreNews ? "Loading dispatches..." : "Load More Headlines"}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Empty state when selected topic filter yields no results */}
          {selectedTopic && (
            (activeTab === "news" && news.length === 0) ||
            (activeTab === "cinema" && movies.length === 0) ||
            (activeTab === "all" && news.length === 0 && movies.length === 0)
          ) && (
            <EmptyState
              title={`No dispatches found for #${selectedTopic}`}
              body="Try choosing another topic filter or view all topics."
            />
          )}
        </>
      )}
    </div>
  );
}
