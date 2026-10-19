"use client";

import { MovieTrailerModal } from "@/components/content/MovieTrailerModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "@/components/ui/Toast";
import { audioEngine } from "@/lib/audioEngine";
import { handleBookMovieTickets } from "@/lib/booking";
import { shareContent } from "@/lib/share";
import type { ContentItem, Interest } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { toggleInterest } from "@/store/slices/preferencesSlice";
import { ArrowRight, Bookmark, BookmarkCheck, Play, Share2, Star, Ticket } from "lucide-react";
import React, { useState } from "react";

interface Cinematic3DStageProps {
  featuredMovie?: ContentItem;
  featuredNews?: ContentItem;
  featuredMusic?: ContentItem;
  onOpenOrganizer?: () => void;
}

const INTEREST_SHORTLIST: { label: string; interestKey: Interest }[] = [
  { label: "Movies", interestKey: "Movies" },
  { label: "Tech", interestKey: "Technology" },
  { label: "Music", interestKey: "Music" },
  { label: "Travel", interestKey: "Travel" },
  { label: "Sports", interestKey: "Sports" },
];

export function Cinematic3DStage({
  featuredMovie,
  featuredNews,
  featuredMusic,
  onOpenOrganizer,
}: Cinematic3DStageProps) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const activeInterests = preferences.interests;

  // Active center card index: 0 = Movie, 1 = News, 2 = Music
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active movie fallback matching the reference image (Interstellar)
  const movie: ContentItem = featuredMovie ?? {
    id: "movie-157336",
    type: "movie",
    title: "Interstellar",
    description: "A journey beyond time and space for a better tomorrow.",
    image: "https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    categories: ["Movies", "Science", "Technology"],
    source: "TMDB",
    url: "https://www.themoviedb.org/movie/157336",
    publishedAt: "2014-11-05T00:00:00.000Z",
    provenance: "mock",
    metadata: {
      rating: 8.4,
      year: 2014,
      trailerKey: "zSWdZVtXT7E",
    },
  };

  // Active tech news fallback matching the reference image
  const news: ContentItem = featuredNews ?? {
    id: "news-ai-human",
    type: "news",
    title: "The Future of AI Is More Human",
    description: "How artificial intelligence is reshaping our world.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    categories: ["Technology"],
    source: "Tech News",
    url: "https://example.com/ai-future",
    publishedAt: "2026-10-18T18:00:00.000Z",
    provenance: "mock",
    metadata: {},
  };

  // Active music fallback matching the reference image
  const music: ContentItem = featuredMusic ?? {
    id: "music-good-vibes",
    type: "music",
    title: "Good Vibes",
    description: "Chill beats for your next adventure.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    categories: ["Music"],
    source: "Sonic Radar",
    url: "https://open.spotify.com",
    publishedAt: "2026-10-18T19:00:00.000Z",
    provenance: "mock",
    metadata: {
      audioPreview: "/audio/track-1.wav",
    },
  };

  const handleToggleInterest = (interest: Interest) => {
    dispatch(toggleInterest(interest));
  };

  const handlePlayMusic = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
      toast.info("Audio paused");
    } else {
      const url = music.metadata.audioPreview ?? "/audio/track-1.wav";
      const played = await audioEngine.play(music.id, url);
      if (played) {
        setIsPlayingAudio(true);
        toast.success(`Playing "${music.title}" preview`);
      } else {
        toast.info(`Now listening to "${music.title}"`);
      }
    }
  };

  const handleOpenNews = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (news.url && news.url.startsWith("http")) {
      window.open(news.url, "_blank", "noopener,noreferrer");
    } else {
      toast.info(`Viewing story: ${news.title}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Discovery Stage Container */}
      <div className="relative w-full max-w-4xl min-h-[300px] sm:min-h-[340px] flex items-center justify-center my-2 select-none">
        {/* DESKTOP 3D LAYERED COMPOSITION (>= 768px) */}
        <div className="hidden md:flex items-center justify-center relative w-full h-[320px]">
          {/* 1. LEFT CARD: Tech News (Tilted Back Left) */}
          <div
            onClick={() => setActiveIndex(activeIndex === 1 ? 0 : 1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveIndex(activeIndex === 1 ? 0 : 1);
              }
            }}
            className={`absolute left-[5%] xl:left-[8%] top-1/2 -translate-y-1/2 w-[240px] h-[270px] rounded-[1.8rem] overflow-hidden cursor-pointer transition-all duration-500 ease-out z-10 border border-white/20 dark:border-white/10 shadow-xl ${
              activeIndex === 1
                ? "scale-105 z-30 translate-x-[120px] shadow-2xl"
                : "opacity-90 hover:opacity-100 hover:scale-[0.93]"
            }`}
            style={{
              transform:
                activeIndex === 1
                  ? "perspective(1200px) rotateY(0deg) rotateZ(0deg) scale(1.05)"
                  : "perspective(1200px) rotateY(16deg) rotateZ(-3deg) scale(0.9)",
              transformOrigin: "center center",
            }}
          >
            {/* Background Image */}
            <SafeImage
              src={news.image}
              alt={news.title}
              category="Technology"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

            {/* Content Overlay */}
            <div className="relative z-10 h-full p-5 flex flex-col justify-between text-white">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-semibold tracking-wide">
                  Tech News
                </span>
                <h4 className="font-bold text-sm sm:text-base leading-snug mt-3 line-clamp-2">
                  {news.title}
                </h4>
                <p className="text-[11px] text-white/70 line-clamp-2 mt-1.5 leading-relaxed">
                  {news.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] text-white/50">2h ago</span>
                <button
                  type="button"
                  onClick={handleOpenNews}
                  className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[10px] font-bold text-white transition cursor-pointer"
                >
                  Read
                </button>
              </div>
            </div>
          </div>

          {/* 2. CENTER CARD: Trending Movie (Dominant Hero Card) */}
          <div
            className={`relative w-[480px] lg:w-[520px] h-[300px] rounded-[2.2rem] overflow-hidden z-20 transition-all duration-500 ease-out ${
              activeIndex === 0
                ? "shadow-[0_20px_50px_-10px_rgba(37,99,235,0.35)] dark:shadow-[0_0_45px_-5px_rgba(59,130,246,0.5)] border-2 border-blue-400/80 dark:border-blue-400/90 scale-100"
                : "scale-95 opacity-90 cursor-pointer"
            }`}
            onClick={() => {
              if (activeIndex !== 0) setActiveIndex(0);
            }}
            style={{
              transform: "perspective(1200px) translateZ(30px)",
              transformOrigin: "center center",
            }}
          >
            {/* Cinematic Planet / Space Image */}
            <SafeImage
              src={movie.image}
              alt={movie.title}
              category="Movies"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Vignette & Contrast Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

            {/* Card Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/25 border border-blue-400/40 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Movie
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{movie.metadata?.rating ? movie.metadata.rating.toFixed(1) : "8.6"}</span>
                </span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/80">{movie.metadata?.year || 2024}</span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/80">
                  {movie.metadata?.runtime
                    ? `${Math.floor(movie.metadata.runtime / 60)}h ${movie.metadata.runtime % 60}m`
                    : "2h 46m"}
                </span>
              </div>

              <h3 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white mt-1.5 leading-tight drop-shadow-md">
                {movie.title}
              </h3>

              <p className="text-xs sm:text-sm text-white/80 max-w-sm mt-2 line-clamp-2 leading-relaxed drop-shadow-sm">
                {movie.description}
              </p>

              {/* Action Buttons: 'Watch Trailer' & 'Book Tickets' */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTrailerModal(true);
                    }}
                    className="cursor-pointer relative z-30 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/40 transition-all duration-200 active:scale-95"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Watch Trailer</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookMovieTickets(movie.title, movie.metadata?.year);
                    }}
                    className="cursor-pointer relative z-30 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all duration-200 active:scale-95"
                  >
                    <Ticket className="h-3.5 w-3.5 text-blue-300" />
                    <span>Book Tickets</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 relative z-30">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleFavorite(movie));
                      toast.success(`Watchlist updated for "${movie.title}"`);
                    }}
                    aria-label="Toggle watchlist"
                    className="grid h-8 w-8 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur transition cursor-pointer"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await shareContent(movie);
                    }}
                    aria-label="Share movie"
                    className="grid h-8 w-8 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur transition cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT CARD: Music (Tilted Back Right) */}
          <div
            onClick={() => setActiveIndex(activeIndex === 2 ? 0 : 2)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveIndex(activeIndex === 2 ? 0 : 2);
              }
            }}
            className={`absolute right-[5%] xl:right-[8%] top-1/2 -translate-y-1/2 w-[240px] h-[270px] rounded-[1.8rem] overflow-hidden cursor-pointer transition-all duration-500 ease-out z-10 border border-white/20 dark:border-white/10 shadow-xl ${
              activeIndex === 2
                ? "scale-105 z-30 -translate-x-[120px] shadow-2xl"
                : "opacity-90 hover:opacity-100 hover:scale-[0.93]"
            }`}
            style={{
              transform:
                activeIndex === 2
                  ? "perspective(1200px) rotateY(0deg) rotateZ(0deg) scale(1.05)"
                  : "perspective(1200px) rotateY(-16deg) rotateZ(3deg) scale(0.9)",
              transformOrigin: "center center",
            }}
          >
            {/* Background Image */}
            <SafeImage
              src={music.image}
              alt={music.title}
              category="Music"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

            {/* Content Overlay */}
            <div className="relative z-10 h-full p-5 flex flex-col justify-between text-white">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-semibold tracking-wide">
                  Music
                </span>
                <h4 className="font-bold text-sm sm:text-base leading-snug mt-3 line-clamp-2">
                  {music.title}
                </h4>
                <p className="text-[11px] text-white/70 line-clamp-2 mt-1.5 leading-relaxed">
                  {music.description}
                </p>
              </div>

              {/* Circular Play Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] text-white/50">Sonic Radar</span>
                <button
                  type="button"
                  onClick={handlePlayMusic}
                  aria-label={`Play audio preview for ${music.title}`}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/25 hover:bg-white/40 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className={`h-3.5 w-3.5 ${isPlayingAudio ? "text-emerald-400" : "fill-current"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE RESPONSIVE ADAPTATION (< 768px) */}
        <div className="md:hidden w-full flex flex-col items-center">
          <div className="relative w-full aspect-[16/10] max-h-[300px] rounded-[1.8rem] overflow-hidden border border-blue-500/50 shadow-xl">
            {activeIndex === 0 && (
              <>
                <SafeImage
                  src={movie.image}
                  alt={movie.title}
                  category="Movies"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                <div className="relative z-10 h-full p-5 flex flex-col justify-end text-white">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-blue-300">
                    Trending Movie
                  </span>
                  <h3 className="font-bold text-xl text-white mt-0.5">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1">
                    {movie.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTrailerModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md active:scale-95 cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Watch Trailer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBookMovieTickets(movie.title, movie.metadata?.year)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md active:scale-95 cursor-pointer"
                    >
                      <Ticket className="h-3 w-3 text-blue-300" />
                      <span>Book Tickets</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeIndex === 1 && (
              <>
                <SafeImage
                  src={news.image}
                  alt={news.title}
                  category="Technology"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                <div className="relative z-10 h-full p-5 flex flex-col justify-end text-white">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-purple-300">
                    Tech News
                  </span>
                  <h3 className="font-bold text-xl text-white mt-0.5">
                    {news.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1">
                    {news.description}
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleOpenNews}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-bold shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Read Story</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeIndex === 2 && (
              <>
                <SafeImage
                  src={music.image}
                  alt={music.title}
                  category="Music"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                <div className="relative z-10 h-full p-5 flex flex-col justify-end text-white">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-pink-300">
                    Music Spotlight
                  </span>
                  <h3 className="font-bold text-xl text-white mt-0.5">
                    {music.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1">
                    {music.description}
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handlePlayMusic}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-600 text-white text-xs font-bold shadow-md active:scale-95 cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{isPlayingAudio ? "Pause" : "Play Preview"}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile stage selector indicators */}
          <div className="flex items-center gap-2 mt-3">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View stage card ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "w-6 bg-indigo-600 dark:bg-indigo-400"
                    : "w-2 bg-neutral-300 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Interest Selector Bar Directly Under the Stage */}
      <div className="mt-2 sm:mt-3 flex items-center justify-center w-full">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2 rounded-full backdrop-blur-2xl bg-white/80 dark:bg-[#0c101d]/85 border border-black/[0.06] dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.6)]">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 pr-1">
            Your Interests
          </span>

          {INTEREST_SHORTLIST.map((item) => {
            const isSelected = activeInterests.includes(item.interestKey);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleToggleInterest(item.interestKey)}
                aria-pressed={isSelected}
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected
                    ? "bg-[#6366f1] text-white font-semibold shadow-xs"
                    : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12]"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Quick Organizer Modal Action Arrow */}
          <button
            type="button"
            onClick={onOpenOrganizer}
            aria-label="Customize full topic interests"
            title="Open all topic filters"
            className="grid h-6 w-6 place-items-center rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition cursor-pointer"
          >
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {showTrailerModal && (
        <MovieTrailerModal
          item={movie}
          onClose={() => setShowTrailerModal(false)}
        />
      )}
    </div>
  );
}
