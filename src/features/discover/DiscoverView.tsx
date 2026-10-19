"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { HorizontalRail } from "@/components/content/HorizontalRail";
import { MovieRail } from "@/components/content/MovieRail";
import { MusicCard } from "@/components/content/MusicCard";
import { SocialCard } from "@/components/content/SocialCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { MOCK_MUSIC } from "@/lib/mock/music";
import { MOCK_SOCIAL } from "@/lib/mock/social";
import { rankContent } from "@/lib/personalization";
import type { ContentItem, FeedModuleId } from "@/lib/types";
import { useGetMoviesQuery, useGetNewsQuery } from "@/store/api/contentApi";
import { useAppSelector } from "@/store/hooks";
import { Disc3, MessageSquare, SlidersHorizontal, Sparkles } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Cinematic3DStage } from "./Cinematic3DStage";
import { FeedOrganizerModal } from "./FeedOrganizerModal";
import { PersonalActivityBar } from "./PersonalActivityBar";
import { PersonalCollectionsGrid } from "./PersonalCollectionsGrid";
import { PickedForYouGrid } from "./PickedForYouGrid";
import { TogetherLounges } from "./TogetherLounges";
import { TrendingQuickPanel } from "./TrendingQuickPanel";

export function DiscoverView() {
  const preferences = useAppSelector((state) => state.preferences);
  const feedOrder = useAppSelector((state) => state.layout.feedOrder);
  const groups = useAppSelector((state) => state.together.groups);
  const vibe = useAppSelector((state) => state.myspace.vibe);

  const [organizerOpen, setOrganizerOpen] = useState(false);

  // Time of day greeting matching the reference image
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

  // Ranked content pipelines shaped by active personalization signals and vibe
  const news = useMemo(
    () => rankContent(newsQuery.data?.items ?? [], preferences),
    [newsQuery.data, preferences],
  );

  const movies = useMemo(
    () => rankContent(moviesQuery.data?.items ?? [], preferences),
    [moviesQuery.data, preferences],
  );

  const music = useMemo(() => rankContent(MOCK_MUSIC, preferences), [preferences]);
  const social = useMemo(() => rankContent(MOCK_SOCIAL, preferences), [preferences]);

  // Lead spotlight recommendations
  const heroItems: ContentItem[] = useMemo(() => {
    const list: ContentItem[] = [];
    const hasMovies = preferences.interests.includes("Movies");
    const hasVibeCinema = vibe === "feel-good";

    if (hasMovies || hasVibeCinema) {
      if (movies[0]) list.push(movies[0]);
      if (news[0]) list.push(news[0]);
      if (movies[1]) list.push(movies[1]);
      if (news[1]) list.push(news[1]);
    } else {
      if (news[0]) list.push(news[0]);
      if (movies[0]) list.push(movies[0]);
      if (news[1]) list.push(news[1]);
      if (movies[1]) list.push(movies[1]);
    }
    return list.filter(Boolean);
  }, [movies, news, preferences.interests, vibe]);

  const isLoading = newsQuery.isLoading && moviesQuery.isLoading;
  const isError = newsQuery.isError && moviesQuery.isError;

  // Render individual modules dynamically ordered according to state.layout.feedOrder
  const renderModule = (moduleId: FeedModuleId) => {
    switch (moduleId) {
      case "topics":
        return (
          <PickedForYouGrid
            key="module-topics"
            movieItem={movies[1] ?? movies[0]}
            newsItem={news[0]}
            musicItem={music[0]}
            socialItem={social[0]}
          />
        );

      case "movies":
        return (
          <ScrollReveal key="module-movies" distancePx={24} threshold={0.08}>
            <MovieRail
              title="Your Next Film · Cinema Radar"
              subtitle="Authentic box office releases, festival premieres, and official trailers."
              movies={movies}
              provenance={moviesQuery.data?.provenance}
              message={moviesQuery.data?.message}
            />
          </ScrollReveal>
        );

      case "news":
        return <PersonalCollectionsGrid key="module-news" news={news} />;

      case "music":
        return (
          <ScrollReveal key="module-music" distancePx={24} threshold={0.08}>
            <HorizontalRail
              title="Your Kind of Music · Sonic Radar"
              subtitle="Interactive audio previews, album artwork, and vinyl pressings."
              icon={<Disc3 className="h-4 w-4 text-pink-500" />}
              badge="Soundstage"
              badgeColor="border-pink-500/30 text-pink-500 bg-pink-500/10"
              actionLink={{ href: "/favorites", label: "Vinyl Shelf" }}
            >
              {music.map((track) => (
                <div key={track.id} className="w-[230px] shrink-0 sm:w-[250px] snap-start">
                  <MusicCard item={track} />
                </div>
              ))}
            </HorizontalRail>
          </ScrollReveal>
        );

      case "social":
        return (
          <ScrollReveal key="module-social" distancePx={24} threshold={0.08}>
            <HorizontalRail
              title="Community Voices & Discussions"
              subtitle="Member perspectives, shared discoveries, and discussion threads."
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
        return <TogetherLounges key="module-together" groups={groups} />;

      case "myspace":
        return <PersonalActivityBar key="module-myspace" />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 w-full">
      {/* 1. TOP HERO SECTION MATCHING THE REFERENCE COMPOSITION */}
      <section aria-label="Hero Discovery Stage" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] xl:grid-cols-[1fr_330px] gap-6 lg:gap-8 items-start">
          {/* LEFT/CENTER: Greeting + 3D Layered Stage + Interest Selector Bar */}
          <div className="flex flex-col space-y-4 w-full min-w-0">
            {/* Greeting Header */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {timeOfDayGreeting},{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {firstName}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                Here&apos;s what&apos;s trending for you today.
              </p>
            </div>

            {/* Central 3D Layered Cinematic Discovery Stage */}
            <Cinematic3DStage
              featuredMovie={movies[0]}
              featuredNews={news[0]}
              featuredMusic={music[0]}
              onOpenOrganizer={() => setOrganizerOpen(true)}
            />
          </div>

          {/* RIGHT: Trending Now & Quick Actions Panels */}
          <div className="w-full lg:sticky lg:top-5">
            <TrendingQuickPanel featuredItem={movies[0] ?? heroItems[0]} />
          </div>
        </div>
      </section>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-8">
            <Skeleton className="h-[420px] w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-[200px] w-full rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <EmptyState
          title="Discovery streams unavailable"
          body="Could not reach the live broadcast or cinema aggregators right now."
          action={
            <button
              type="button"
              onClick={() => {
                newsQuery.refetch();
                moviesQuery.refetch();
              }}
              className="rounded-full bg-ink text-paper dark:bg-paper dark:text-ink px-5 py-2.5 text-xs font-semibold shadow-md cursor-pointer"
            >
              Retry Discovery Feeds
            </button>
          }
        />
      )}

      {/* 2. SUBSEQUENT DYNAMICALLY ORDERED FEED MODULES */}
      {!isLoading && !isError && (
        <div className="space-y-10 sm:space-y-12 pt-4">
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                Personalized Spectrum Feeds
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOrganizerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.06] dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Customize Feed</span>
            </button>
          </div>

          {feedOrder
            .filter((mod) => mod !== "featured")
            .map((moduleId) => renderModule(moduleId))}
        </div>
      )}

      {/* Empty state when no hero items or content matches */}
      {!isLoading && !isError && heroItems.length === 0 && (
        <EmptyState
          title="No stories match current preferences"
          body="Try selecting different interests in the selector above."
        />
      )}

      {/* Layout Customizer Modal */}
      <FeedOrganizerModal
        isOpen={organizerOpen}
        onClose={() => setOrganizerOpen(false)}
      />
    </div>
  );
}
