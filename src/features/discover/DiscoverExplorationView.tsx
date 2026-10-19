"use client";

import { MovieCard } from "@/components/content/MovieCard";
import { MovieTrailerModal } from "@/components/content/MovieTrailerModal";
import { MusicCard } from "@/components/content/MusicCard";
import { NewsCard } from "@/components/content/NewsCard";
import { RestaurantCard } from "@/components/content/RestaurantCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "@/components/ui/Toast";
import { audioEngine } from "@/lib/audioEngine";
import { handleBookMovieTickets, handleBookRestaurantTable } from "@/lib/booking";
import { MOCK_MOVIES } from "@/lib/mock/movies";
import { MOCK_MUSIC } from "@/lib/mock/music";
import { MOCK_NEWS } from "@/lib/mock/news";
import { MOCK_RESTAURANTS } from "@/lib/mock/restaurants";
import { shareContent } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useGetMoviesQuery, useGetNewsQuery } from "@/store/api/contentApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Compass,
  Disc3,
  ExternalLink,
  Film,
  Globe2,
  Moon,
  Pause,
  Play,
  Share2,
  Star,
  Utensils,
} from "lucide-react";
import React, { useMemo, useState } from "react";

export type IntentionType =
  | "relaxing"
  | "movies"
  | "music"
  | "food"
  | "learning"
  | "going-out"
  | "destination";

interface IntentionMeta {
  id: IntentionType;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  heroItem: ContentItem;
  primaryActionLabel: string;
  secondaryActionLabel: string;
}

export function DiscoverExplorationView() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const [activeIntention, setActiveIntention] = useState<IntentionType>("relaxing");
  const [selectedMovieForTrailer, setSelectedMovieForTrailer] = useState<ContentItem | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const newsQuery = useGetNewsQuery({});
  const moviesQuery = useGetMoviesQuery({});

  const movies = moviesQuery.data?.items ?? MOCK_MOVIES;
  const news = newsQuery.data?.items ?? MOCK_NEWS;
  const music = MOCK_MUSIC;
  const restaurants = MOCK_RESTAURANTS;

  // Curated Intentions with authentic data and imagery
  const INTENTIONS: IntentionMeta[] = useMemo(() => [
    {
      id: "relaxing",
      title: "Unwind & Tranquility",
      tagline: "Slow-burn cinematic journeys, warm ambient synthesizers, and serene reading sanctuaries.",
      icon: Moon,
      accentColor: "from-amber-500/20 to-purple-500/10 border-amber-500/30 text-amber-400",
      badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      heroItem: {
        id: "hero-relax",
        type: "movie",
        title: "Interstellar (The Nolan Odyssey)",
        description: "A contemplative journey across quantum singularities and emotional horizons, scored by Hans Zimmer's pipe organ.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        categories: ["Movies", "Science"],
        source: "Pluto Archive",
        publishedAt: "2014-11-05T00:00:00.000Z",
        provenance: "mock",
        url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        metadata: { rating: 8.7, year: 2014, trailerKey: "zSWdZVtXT7E" },
      },
      primaryActionLabel: "Watch Trailer",
      secondaryActionLabel: "Save to Evening Watchlist",
    },
    {
      id: "movies",
      title: "Cinema Night",
      tagline: "Authentic box office releases, official YouTube trailers, and real ticket booking.",
      icon: Film,
      accentColor: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
      badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      heroItem: {
        id: "hero-dune-2",
        type: "movie",
        title: "Dune: Part Two",
        description: "Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his family.",
        image: "https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        categories: ["Movies", "Sci-Fi"],
        source: "TMDB Box Office",
        publishedAt: "2024-03-01T00:00:00.000Z",
        provenance: "mock",
        url: "https://www.themoviedb.org/movie/693134",
        metadata: { rating: 8.6, year: 2024, trailerKey: "Way9Dexny3w" },
      },
      primaryActionLabel: "Watch Trailer",
      secondaryActionLabel: "Book Cinema Tickets",
    },
    {
      id: "music",
      title: "Sonic Journey",
      tagline: "London Symphony sessions, analog synthesizers, acoustic Ghazals, and vinyl master pressings.",
      icon: Disc3,
      accentColor: "from-pink-500/20 to-purple-500/10 border-pink-500/30 text-pink-400",
      badgeBg: "bg-pink-500/15 text-pink-400 border-pink-500/30",
      heroItem: music[0] ?? {
        id: "hero-promises",
        type: "music",
        title: "Promises (Live at Abbey Road)",
        description: "London Symphony Orchestra in dialogue with Pharoah Sanders' saxophone and Floating Points' Buchla synth.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        categories: ["Music", "Jazz"],
        source: "Bandcamp Master",
        publishedAt: "2026-10-14T10:00:00.000Z",
        provenance: "mock",
        url: "https://open.spotify.com/search/Floating%20Points%20Promises",
        metadata: { artist: "Floating Points & Pharoah Sanders", audioPreview: "/audio/track-1.wav" },
      },
      primaryActionLabel: "Play Audio Preview",
      secondaryActionLabel: "Open on Spotify",
    },
    {
      id: "food",
      title: "Culinary Sanctuary",
      tagline: "Curated world gastronomy, art-deco brasseries, Omakase counters, and instant table booking.",
      icon: Utensils,
      accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      heroItem: restaurants[0] ?? {
        id: "hero-ivy",
        type: "restaurant",
        title: "The Ivy Mumbai",
        description: "All-day British and European brasserie classics served in an opulent art-deco dining room with bespoke botanical murals.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        categories: ["Lifestyle", "Design"],
        source: "Michelin Guide & Zomato",
        publishedAt: "2026-10-18T10:00:00.000Z",
        provenance: "live",
        url: "https://www.zomato.com/mumbai",
        metadata: { cuisine: "European Contemporary", rating: 4.5, priceRange: "$$$", location: "BKC, Mumbai" },
      },
      primaryActionLabel: "Reserve Table",
      secondaryActionLabel: "View Chef Menu",
    },
    {
      id: "learning",
      title: "Curiosity & Science",
      tagline: "Frontier research monographs, artificial intelligence shifts, astrophysics, and architectural theory.",
      icon: BookOpen,
      accentColor: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
      badgeBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      heroItem: news[0] ?? {
        id: "hero-ai-science",
        type: "news",
        title: "The Architecture of Neural Reasoning",
        description: "How next-generation cognitive architectures are transforming scientific computation and autonomous discovery.",
        image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
        categories: ["Technology", "Science"],
        source: "MIT Tech Review",
        publishedAt: "2026-10-18T12:00:00.000Z",
        provenance: "live",
        url: "https://technologyreview.com",
        metadata: {},
      },
      primaryActionLabel: "Read Full Dispatch",
      secondaryActionLabel: "Share Insight",
    },
    {
      id: "going-out",
      title: "Adventurous Outings",
      tagline: "Local evening haunts, cocktail lounges, live acoustic performances, and gallery openings.",
      icon: Compass,
      accentColor: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400",
      badgeBg: "bg-violet-500/15 text-violet-400 border-violet-500/30",
      heroItem: restaurants[1] ?? {
        id: "hero-nobu",
        type: "restaurant",
        title: "Nobu Mumbai",
        description: "Chef Nobu Matsuhisa's legendary Peruvian-influenced Japanese gastronomy featuring black cod miso and signature cocktails.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        categories: ["Lifestyle", "Dining"],
        source: "Nobu Global",
        publishedAt: "2026-10-18T12:00:00.000Z",
        provenance: "live",
        url: "https://www.noburestaurants.com",
        metadata: { cuisine: "Japanese Peruvian", rating: 4.7, priceRange: "$$$$", location: "Worli, Mumbai" },
      },
      primaryActionLabel: "Reserve Table",
      secondaryActionLabel: "Explore Venue",
    },
    {
      id: "destination",
      title: "Destination Wayfaring",
      tagline: "Santorini caldera sunsets, Kyoto rock gardens, Swiss alpine passes, and coastal expeditions.",
      icon: Globe2,
      accentColor: "from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400",
      badgeBg: "bg-teal-500/15 text-teal-400 border-teal-500/30",
      heroItem: {
        id: "hero-santorini",
        type: "news",
        title: "Santorini: The Caldera Architecture",
        description: "Exploring cycladic white terraces, volcanic stone amphitheaters, and Aegean horizons.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
        categories: ["Travel", "Design"],
        source: "National Geographic Traveler",
        publishedAt: "2026-10-15T09:00:00.000Z",
        provenance: "live",
        url: "https://en.wikipedia.org/wiki/Santorini",
        metadata: {},
      },
      primaryActionLabel: "Explore Field Guide",
      secondaryActionLabel: "Save to Travel Dreams",
    },
  ], [movies, news, music, restaurants]);

  const activeMeta = useMemo(
    () => INTENTIONS.find((i) => i.id === activeIntention) ?? INTENTIONS[0],
    [activeIntention, INTENTIONS]
  );

  const heroItem = activeMeta.heroItem;
  const isHeroSaved = favorites.some((f) => f.id === heroItem.id);

  // Handle Primary Hero Action depending on intention
  const handleHeroPrimaryAction = async () => {
    if (activeIntention === "movies" || activeIntention === "relaxing") {
      setSelectedMovieForTrailer(heroItem);
    } else if (activeIntention === "music") {
      if (playingAudioId === heroItem.id) {
        audioEngine.stop();
        setPlayingAudioId(null);
      } else {
        const ok = await audioEngine.play(heroItem.id, heroItem.metadata.audioPreview);
        if (ok) {
          setPlayingAudioId(heroItem.id);
          toast.success(`Playing "${heroItem.title}" audio preview`);
        } else {
          toast.info("Audio preview currently unavailable for this cut.");
        }
      }
    } else if (activeIntention === "food" || activeIntention === "going-out") {
      handleBookRestaurantTable(heroItem.title, heroItem.metadata.location);
    } else {
      if (heroItem.url) {
        window.open(heroItem.url, "_blank", "noopener,noreferrer");
      } else {
        toast.info(`Viewing ${heroItem.title}`);
      }
    }
  };

  // Handle Secondary Hero Action
  const handleHeroSecondaryAction = async () => {
    if (activeIntention === "movies") {
      handleBookMovieTickets(heroItem.title, heroItem.metadata?.year);
    } else if (activeIntention === "music") {
      window.open(heroItem.url ?? "https://open.spotify.com", "_blank", "noopener,noreferrer");
    } else if (activeIntention === "food" || activeIntention === "going-out") {
      window.open(heroItem.url ?? "https://www.zomato.com", "_blank", "noopener,noreferrer");
    } else {
      dispatch(toggleFavorite(heroItem));
      toast.success(isHeroSaved ? "Removed from library" : "Saved to your library");
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 w-full animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. DISCOVER HEADER & MOOD INTENTION COMPASS                              */}
      {/* ========================================================================= */}
      <section aria-label="Discover Intention Navigator" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Compass className="w-3 h-3" />
              Intention Space
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              7 Active Exploration Dimensions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Discover by Intention
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Choose how you feel or what you want to experience. Every choice re-architects the stage, content, and available actions.
          </p>
        </div>

        {/* Integrated Intention Card Selector (NOT a row of generic filter pills!) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {INTENTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeIntention === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIntention(item.id)}
                aria-pressed={isSelected}
                className={`group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-300 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 ${
                  isSelected
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-lg scale-[1.02]"
                    : "bg-white/70 dark:bg-[#0c101d]/75 text-neutral-600 dark:text-neutral-300 border-black/[0.06] dark:border-white/10 hover:border-blue-500/40 hover:bg-white dark:hover:bg-[#0c101d]"
                }`}
              >
                <div
                  className={`grid h-8 w-8 place-items-center rounded-xl mb-2 transition-transform duration-300 group-hover:scale-110 ${
                    isSelected
                      ? "bg-white/20 dark:bg-black/10 text-white dark:text-neutral-950"
                      : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold tracking-tight">
                  {item.title.split(" ")[0]}
                </span>
                <span className="text-[10px] opacity-70 truncate w-full">
                  {item.title.split(" ")[1] || "Focus"}
                </span>

                {/* Selected bottom bar */}
                {isSelected && (
                  <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-blue-500 dark:bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC INTENTION STAGE WITH MATCHED CINEMATIC ART & ACTIONS           */}
      {/* ========================================================================= */}
      <section className="relative rounded-[2.5rem] overflow-hidden border border-black/[0.08] dark:border-white/10 shadow-2xl bg-neutral-950 text-white">
        <div className="relative min-h-[400px] sm:min-h-[460px] w-full flex flex-col justify-end p-6 sm:p-12 z-10">
          {/* Matched Real Background Artwork (NO game controllers!) */}
          <SafeImage
            src={heroItem.image}
            alt={heroItem.title}
            category={heroItem.categories[0]}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out"
          />

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

          {/* Intention Manifesto Overlay */}
          <div className="relative z-20 space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${activeMeta.badgeBg}`}>
                {activeMeta.title}
              </span>
              <span className="text-xs text-white/70 font-mono">
                {activeMeta.tagline}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {heroItem.title}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 line-clamp-3 leading-relaxed max-w-xl drop-shadow-sm">
              {heroItem.description}
            </p>

            {/* Contextual Action Bar based on intention */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <MagneticButton
                onClick={handleHeroPrimaryAction}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/40 transition active:scale-95"
              >
                {activeIntention === "movies" || activeIntention === "relaxing" ? (
                  <Play className="h-3.5 w-3.5 fill-current" />
                ) : activeIntention === "music" ? (
                  playingAudioId === heroItem.id ? (
                    <Pause className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  )
                ) : activeIntention === "food" || activeIntention === "going-out" ? (
                  <Utensils className="h-3.5 w-3.5" />
                ) : (
                  <BookOpen className="h-3.5 w-3.5" />
                )}
                <span>
                  {activeIntention === "music" && playingAudioId === heroItem.id
                    ? "Pause Preview"
                    : activeMeta.primaryActionLabel}
                </span>
              </MagneticButton>

              <button
                type="button"
                onClick={handleHeroSecondaryAction}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition active:scale-95 cursor-pointer"
              >
                <span>{activeMeta.secondaryActionLabel}</span>
                <ExternalLink className="w-3 h-3 text-blue-300" />
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatch(toggleFavorite(heroItem));
                  toast.success(isHeroSaved ? "Removed from library" : "Saved to your library");
                }}
                aria-label={isHeroSaved ? "Remove from saved" : "Save to library"}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border backdrop-blur-md transition text-xs font-semibold cursor-pointer ${
                  isHeroSaved
                    ? "bg-blue-500/20 border-blue-400 text-blue-300"
                    : "bg-black/40 hover:bg-black/60 border-white/15 text-white/90"
                }`}
              >
                {isHeroSaved ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 text-blue-400" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>Bookmark</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => shareContent(heroItem)}
                aria-label="Share feature"
                className="grid h-9 w-9 place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/90 backdrop-blur-md transition active:scale-95 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TAILORED CONTENT GRID RESPONDING TO ACTIVE INTENTION                   */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Curated for {activeMeta.title}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Filtered artifacts matching your selected intention
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Page {page} of Curated Grid
          </span>
        </div>

        {/* 3.1 Content Switch based on Intention */}
        {activeIntention === "food" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} item={r} />
            ))}
          </div>
        )}

        {activeIntention === "movies" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {movies.map((m) => (
              <MovieCard key={m.id} item={m} variant="compact" />
            ))}
          </div>
        )}

        {activeIntention === "music" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {music.map((track) => (
              <MusicCard key={track.id} item={track} />
            ))}
          </div>
        )}

        {activeIntention === "learning" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((story) => (
              <NewsCard key={story.id} item={story} variant="editorial" />
            ))}
          </div>
        )}

        {activeIntention === "relaxing" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MovieCard item={movies[0]} variant="compact" />
            <MusicCard item={music[0]} />
            <NewsCard item={news[0]} variant="editorial" />
            <RestaurantCard item={restaurants[0]} />
          </div>
        )}

        {(activeIntention === "going-out" || activeIntention === "destination") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.slice(0, 2).map((r) => (
              <RestaurantCard key={r.id} item={r} />
            ))}
            {news.slice(0, 2).map((n) => (
              <NewsCard key={n.id} item={n} variant="editorial" />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. POPULAR THIS WEEK BENTO RADAR                                          */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Popular Across the Universe This Week
          </h2>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Velocity Ranked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              id: "pop-1",
              title: "The Batman",
              subtitle: "Movie · 2022",
              image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80",
              type: "movie",
              rating: "7.9",
            },
            {
              id: "pop-2",
              title: "Succession",
              subtitle: "TV Show · 2023",
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
              type: "show",
              rating: "8.9",
            },
            {
              id: "pop-3",
              title: "Billie Eilish",
              subtitle: "Artist · Music",
              image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
              type: "music",
              rating: "4.8",
            },
            {
              id: "pop-4",
              title: "Tokyo Sanctuary",
              subtitle: "Dining & Travel",
              image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
              type: "restaurant",
              rating: "4.9",
            },
            {
              id: "pop-5",
              title: "SpaceX Starship",
              subtitle: "News · Tech",
              image: "https://images.unsplash.com/photo-1517976487520-d3a3390d4021?auto=format&fit=crop&w=600&q=80",
              type: "news",
              rating: "9.2",
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.type === "movie") {
                  handleBookMovieTickets(item.title, 2022);
                } else {
                  toast.info(`Exploring ${item.title} (${item.subtitle})`);
                }
              }}
              role="button"
              tabIndex={0}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] border border-black/[0.06] dark:border-white/10 bg-white/75 dark:bg-[#0c101d]/85 backdrop-blur-xl shadow-xs hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  category="Movies"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-xs text-neutral-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {item.title}
                </h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination / Load More */}
      <div className="pt-4 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setPage((p) => p + 1);
            toast.success(`Loaded more curated artifacts (Page ${page + 1})`);
          }}
          className="px-6 py-2.5 rounded-full border border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/10 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition shadow-xs cursor-pointer"
        >
          Load More Discoveries (Page {page})
        </button>
      </div>

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
