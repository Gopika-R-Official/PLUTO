"use client";

import { HorizontalRail } from "@/components/content/HorizontalRail";
import { MovieCard } from "@/components/content/MovieCard";
import { MovieRail } from "@/components/content/MovieRail";
import { MovieTrailerModal } from "@/components/content/MovieTrailerModal";
import { MusicCard } from "@/components/content/MusicCard";
import { NewsCard } from "@/components/content/NewsCard";
import { RestaurantCard } from "@/components/content/RestaurantCard";
import { SocialCard } from "@/components/content/SocialCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltedCard } from "@/components/ui/TiltedCard";
import { toast } from "@/components/ui/Toast";
import { FeedOrganizerModal } from "@/features/discover/FeedOrganizerModal";
import { TogetherLounges } from "@/features/discover/TogetherLounges";
import { handleBookMovieTickets } from "@/lib/booking";
import { MOCK_MOVIES } from "@/lib/mock/movies";
import { MOCK_MUSIC } from "@/lib/mock/music";
import { MOCK_NEWS } from "@/lib/mock/news";
import { MOCK_RESTAURANTS } from "@/lib/mock/restaurants";
import { MOCK_SOCIAL } from "@/lib/mock/social";
import { rankContent } from "@/lib/personalization";
import { shareContent } from "@/lib/share";
import type { ContentItem, FeedModuleId, Interest } from "@/lib/types";
import { useGetMoviesQuery, useGetNewsQuery } from "@/store/api/contentApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { toggleInterest } from "@/store/slices/preferencesSlice";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Compass,
  Disc3,
  Flame,
  MessageSquare,
  Play,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Ticket,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const TOPIC_CHIP_LIST: Interest[] = [
  "Technology",
  "Movies",
  "Music",
  "Travel",
  "Design",
];

export function HomeView() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favorites = useAppSelector((state) => state.favorites.items);
  const groups = useAppSelector((state) => state.together.groups);
  const feedOrder = useAppSelector((state) => state.layout.feedOrder);

  const [organizerOpen, setOrganizerOpen] = useState(false);
  const [selectedMovieForTrailer, setSelectedMovieForTrailer] = useState<ContentItem | null>(null);

  // Time of day greeting
  const timeOfDayGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const firstName = useMemo(() => {
    const raw = preferences.displayName?.trim();
    if (!raw) return "Alex";
    return raw.split(" ")[0];
  }, [preferences.displayName]);

  const topics = preferences.interests.join(",");
  const newsQuery = useGetNewsQuery({ topics });
  const moviesQuery = useGetMoviesQuery({ topics });

  // Ranked content pipelines
  const news = useMemo(
    () => rankContent(newsQuery.data?.items ?? MOCK_NEWS, preferences),
    [newsQuery.data, preferences],
  );

  const movies = useMemo(
    () => rankContent(moviesQuery.data?.items ?? MOCK_MOVIES, preferences),
    [moviesQuery.data, preferences],
  );

  const music = useMemo(() => rankContent(MOCK_MUSIC, preferences), [preferences]);
  const social = useMemo(() => rankContent(MOCK_SOCIAL, preferences), [preferences]);
  const restaurants = MOCK_RESTAURANTS;

  // Dominant Featured Discovery (Dune: Part Two or Interstellar)
  const featuredMovie: ContentItem = useMemo(() => {
    return (
      movies.find((m) => m.title.toLowerCase().includes("dune")) ??
      movies[0] ??
      MOCK_MOVIES[0]
    );
  }, [movies]);

  const isFeaturedSaved = favorites.some((f) => f.id === featuredMovie.id);

  const handleToggleTopic = (topic: Interest) => {
    dispatch(toggleInterest(topic));
  };

  const isLoading = newsQuery.isLoading && moviesQuery.isLoading;

  // Render individual feed module in response to feedOrder sequence
  const renderFeedModule = (moduleId: FeedModuleId) => {
    switch (moduleId) {
      case "featured":
        return (
          <section key="module-featured" aria-label="Personalized Editorial Stage" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Dominant Featured Discovery */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                <TiltedCard maxTilt={5} scale={1.01} className="w-full h-full rounded-[2.2rem]">
                  <div className="relative h-full min-h-[380px] sm:min-h-[440px] w-full rounded-[2.2rem] overflow-hidden border border-black/[0.08] dark:border-white/10 shadow-2xl bg-neutral-950 text-white group flex flex-col justify-end p-6 sm:p-10">
                    <SafeImage
                      src={featuredMovie.image}
                      alt={featuredMovie.title}
                      category="Movies"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

                    <div className="relative z-10 space-y-3 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/40 text-[10px] font-bold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                          Featured Cinema
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-amber-400">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{featuredMovie.metadata?.rating ? featuredMovie.metadata.rating.toFixed(1) : "8.6"}</span>
                        </span>
                        <span className="text-xs text-white/70 font-mono">
                          {featuredMovie.metadata?.year || 2024} · 2h 46m · 4K HDR
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                        {featuredMovie.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-neutral-200 line-clamp-3 leading-relaxed max-w-lg drop-shadow-sm">
                        {featuredMovie.description}
                      </p>

                      <div className="pt-3 flex flex-wrap items-center gap-3">
                        <MagneticButton
                          onClick={() => setSelectedMovieForTrailer(featuredMovie)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/40 transition active:scale-95"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Watch Trailer</span>
                        </MagneticButton>

                        <button
                          type="button"
                          onClick={() => handleBookMovieTickets(featuredMovie.title, featuredMovie.metadata?.year)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition active:scale-95 cursor-pointer"
                        >
                          <Ticket className="h-3.5 w-3.5 text-blue-300" />
                          <span>Book Tickets</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            dispatch(toggleFavorite(featuredMovie));
                            toast.success(
                              isFeaturedSaved
                                ? `Removed "${featuredMovie.title}" from watchlist`
                                : `Added "${featuredMovie.title}" to watchlist`,
                            );
                          }}
                          aria-label={isFeaturedSaved ? "Remove from watchlist" : "Save to watchlist"}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border backdrop-blur-md transition text-xs font-semibold cursor-pointer ${
                            isFeaturedSaved
                              ? "bg-blue-500/20 border-blue-400 text-blue-300"
                              : "bg-black/40 hover:bg-black/60 border-white/15 text-white/90"
                          }`}
                        >
                          {isFeaturedSaved ? (
                            <>
                              <BookmarkCheck className="h-3.5 w-3.5 text-blue-400" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="h-3.5 w-3.5" />
                              <span>Watchlist</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => shareContent(featuredMovie)}
                          aria-label="Share movie"
                          className="grid h-9 w-9 place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/90 backdrop-blur-md transition active:scale-95 cursor-pointer"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltedCard>
              </div>

              {/* Right: Cultural Pulse Column */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                <SpotlightCard className="h-full p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500">
                          <Flame className="w-3.5 h-3.5" />
                        </span>
                        <h3 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
                          Cultural Pulse Today
                        </h3>
                      </div>
                      <Link
                        href="/trending"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>More</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {news[0] && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (news[0].url) window.open(news[0].url, "_blank", "noopener,noreferrer");
                          }}
                          className="group flex items-start gap-3 p-2.5 rounded-2xl cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                            <SafeImage
                              src={news[0].image}
                              alt={news[0].title}
                              category="Technology"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              {news[0].categories[0] || "Dispatch"}
                            </span>
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                              {news[0].title}
                            </h4>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                              {news[0].source} · {news[0].description}
                            </p>
                          </div>
                        </div>
                      )}

                      {music[0] && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (music[0].url) window.open(music[0].url, "_blank", "noopener,noreferrer");
                          }}
                          className="group flex items-start gap-3 p-2.5 rounded-2xl cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                            <SafeImage
                              src={music[0].image}
                              alt={music[0].title}
                              category="Music"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400">
                              Sonic Master
                            </span>
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate group-hover:text-pink-500 transition">
                              {music[0].title}
                            </h4>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                              {music[0].metadata.artist} — {music[0].metadata.album}
                            </p>
                          </div>
                        </div>
                      )}

                      {restaurants[0] && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (restaurants[0].url) window.open(restaurants[0].url, "_blank", "noopener,noreferrer");
                          }}
                          className="group flex items-start gap-3 p-2.5 rounded-2xl cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                            <SafeImage
                              src={restaurants[0].image}
                              alt={restaurants[0].title}
                              category="Lifestyle"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              Gastronomy
                            </span>
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate group-hover:text-emerald-500 transition">
                              {restaurants[0].title}
                            </h4>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                              {restaurants[0].metadata.cuisine} · {restaurants[0].metadata.location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <Link
                      href="/discover"
                      className="group flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                          Mood Space
                        </p>
                        <p className="text-xs font-extrabold text-white">
                          Explore By What You Feel →
                        </p>
                      </div>
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20 backdrop-blur-md group-hover:translate-x-0.5 transition-transform">
                        <Compass className="w-4 h-4" />
                      </div>
                    </Link>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          </section>
        );

      case "topics":
        return (
          <ScrollReveal key="module-topics" distancePx={24} threshold={0.08} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Picked For You
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Multi-category curation responding to your preferences: cinema, technical dispatches, and vinyl cuts.
                </p>
              </div>
              <Link
                href="/discover"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Explore All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {movies[1] && (
                <div className="flex flex-col">
                  <MovieCard item={movies[1]} variant="compact" />
                </div>
              )}
              {news[0] && (
                <div className="flex flex-col">
                  <NewsCard item={news[0]} variant="editorial" />
                </div>
              )}
              {music[1] && (
                <div className="flex flex-col">
                  <MusicCard item={music[1]} />
                </div>
              )}
              {restaurants[0] && (
                <div className="flex flex-col">
                  <RestaurantCard item={restaurants[0]} />
                </div>
              )}
            </div>
          </ScrollReveal>
        );

      case "movies":
        return (
          <ScrollReveal key="module-movies" distancePx={24} threshold={0.08}>
            <MovieRail
              title="Cinema Frontier · Official Releases & Trailers"
              subtitle="Box office blockbusters, festival entries, and direct trailer streaming."
              movies={movies}
              provenance={moviesQuery.data?.provenance}
              message={moviesQuery.data?.message}
            />
          </ScrollReveal>
        );

      case "music":
        return (
          <ScrollReveal key="module-music" distancePx={24} threshold={0.08}>
            <HorizontalRail
              title="Sonic Radar · Vinyl Vault & Studio Masters"
              subtitle="Interactive analog previews, acoustic sessions, and vinyl pressings."
              icon={<Disc3 className="h-4 w-4 text-pink-500" />}
              badge="Soundstage"
              badgeColor="border-pink-500/30 text-pink-500 bg-pink-500/10"
              actionLink={{ href: "/music", label: "Open Music Vault" }}
            >
              {music.map((track) => (
                <div key={track.id} className="w-[240px] shrink-0 sm:w-[260px] snap-start">
                  <MusicCard item={track} />
                </div>
              ))}
            </HorizontalRail>
          </ScrollReveal>
        );

      case "news":
        return (
          <ScrollReveal key="module-news" distancePx={24} threshold={0.08}>
            <HorizontalRail
              title="Culinary Sanctuaries · Tables & Reservations"
              subtitle="Curated dining destinations with direct reservation concierge."
              icon={<Utensils className="h-4 w-4 text-emerald-500" />}
              badge="Gastronomy"
              badgeColor="border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
              actionLink={{ href: "/discover", label: "Dining Guide" }}
            >
              {restaurants.map((place) => (
                <div key={place.id} className="w-[300px] shrink-0 sm:w-[340px] snap-start">
                  <RestaurantCard item={place} />
                </div>
              ))}
            </HorizontalRail>
          </ScrollReveal>
        );

      case "social":
        return (
          <ScrollReveal key="module-social" distancePx={24} threshold={0.08}>
            <HorizontalRail
              title="Community Dispatches & Discussions"
              subtitle="Member reviews, shared collections, and live cultural commentary."
              icon={<MessageSquare className="h-4 w-4 text-cyan-500" />}
              badge="Community"
              badgeColor="border-cyan-500/30 text-cyan-500 bg-cyan-500/10"
            >
              {social.map((post) => (
                <div key={post.id} className="w-[280px] shrink-0 sm:w-[320px] snap-start">
                  <SocialCard item={post} />
                </div>
              ))}
            </HorizontalRail>
          </ScrollReveal>
        );

      case "together":
        return (
          <div key="module-together">
            <TogetherLounges groups={groups} />
          </div>
        );

      case "myspace":
        return (
          <section key="module-myspace" className="relative rounded-[2.2rem] overflow-hidden border border-black/[0.08] dark:border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-8 sm:p-12 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                Immersive Exploration
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                How do you want to feel today?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Step into Discover: filter by intention—whether you want to unwind with slow cinema, track down a world-class table, explore ambient synth records, or dive into deep work.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/40 transition active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Launch Mood Explorer</span>
                </Link>

                <Link
                  href="/music"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition active:scale-95"
                >
                  <Disc3 className="w-4 h-4" />
                  <span>Visit Music Vault</span>
                </Link>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -top-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 w-full animate-fadeIn">
      {/* Permanent Header Bar: Greeting + Topic Weighting + Customize Trigger */}
      <section aria-label="Personalized Header Bar" className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3 h-3" />
                Editorial Radar
              </span>
              <span className="text-xs text-neutral-400 font-mono" suppressHydrationWarning>
                {new Date().toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {timeOfDayGreeting},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                {firstName}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Curated cinema releases, tech dispatches, and sonic streams tailored to your interests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {TOPIC_CHIP_LIST.map((topic) => {
              const isSelected = preferences.interests.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleToggleTopic(topic)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isSelected
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs"
                      : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12]"
                  }`}
                >
                  {topic}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setOrganizerOpen(true)}
              aria-label="Customize feed layout"
              title="Customize feed layout"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition text-xs font-medium cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Customize</span>
            </button>
          </div>
        </div>
      </section>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-[1.8rem]" />
          ))}
        </div>
      )}

      {/* Dynamic Feed Modules in feedOrder sequence */}
      {!isLoading && feedOrder.map((modId) => renderFeedModule(modId))}

      {/* Feed Organizer Modal (DnD) */}
      <FeedOrganizerModal
        isOpen={organizerOpen}
        onClose={() => setOrganizerOpen(false)}
      />

      {/* Trailer Modal */}
      {selectedMovieForTrailer && (
        <MovieTrailerModal
          item={selectedMovieForTrailer}
          onClose={() => setSelectedMovieForTrailer(null)}
        />
      )}
    </div>
  );
}
