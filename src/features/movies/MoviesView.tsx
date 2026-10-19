"use client";

import { MovieCard } from "@/components/content/MovieCard";
import { MovieTrailerModal } from "@/components/content/MovieTrailerModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "@/components/ui/Toast";
import { handleBookMovieTickets } from "@/lib/booking";
import { MOCK_MOVIES } from "@/lib/mock/movies";
import { shareContent } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useGetMoviesQuery } from "@/store/api/contentApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Clapperboard,
  Film,
  Flame,
  Play,
  Share2,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";
import React, { useMemo, useState } from "react";

const GENRES = [
  "All Films",
  "Sci-Fi",
  "Action & Adventure",
  "Drama",
  "Thriller",
  "Animation",
];

export function MoviesView() {
  const dispatch = useAppDispatch();
  const moviesQuery = useGetMoviesQuery({});
  const allMovies = moviesQuery.data?.items ?? MOCK_MOVIES;

  const [selectedGenre, setSelectedGenre] = useState("All Films");
  const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<ContentItem | null>(null);

  // Featured Spotlight Film (Dune: Part Two with full metadata & artwork)
  const spotlightMovie: ContentItem = useMemo(() => {
    const dune = allMovies.find((m) => m.title.includes("Dune"));
    if (dune) return dune;
    const interstellar = allMovies.find((m) => m.title.includes("Interstellar"));
    if (interstellar) return interstellar;
    return allMovies[0] ?? {
      id: "movie-dune-2",
      type: "movie",
      title: "Dune: Part Two",
      description:
        "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future.",
      image: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
      categories: ["Movies", "Sci-Fi", "Adventure"],
      source: "TMDB",
      url: "https://www.themoviedb.org/movie/693134",
      publishedAt: "2024-03-01T00:00:00.000Z",
      provenance: "live",
      metadata: {
        rating: 8.4,
        year: 2024,
        trailerKey: "Way9Dexny3w",
      },
    };
  }, [allMovies]);

  const isSaved = useAppSelector((state) =>
    state.favorites.items.some((r) => r.id === spotlightMovie.id),
  );

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(spotlightMovie));
    toast.success(
      isSaved ? `Removed "${spotlightMovie.title}" from watchlist` : `Saved "${spotlightMovie.title}" to watchlist`,
    );
  };

  const handleShare = async () => {
    await shareContent(spotlightMovie);
  };

  // Filter movies by genre
  const filteredMovies = useMemo(() => {
    if (selectedGenre === "All Films") return allMovies;
    if (selectedGenre === "Sci-Fi") {
      return allMovies.filter(
        (m) =>
          m.categories.includes("Science") ||
          m.categories.includes("Sci-Fi") ||
          ["Interstellar", "Dune: Part Two", "Blade Runner 2049", "The Matrix"].some((t) =>
            m.title.includes(t),
          ),
      );
    }
    if (selectedGenre === "Action & Adventure") {
      return allMovies.filter(
        (m) =>
          m.categories.includes("Adventure") ||
          m.categories.includes("Action") ||
          ["The Batman", "Dune: Part Two", "Gladiator"].some((t) => m.title.includes(t)),
      );
    }
    if (selectedGenre === "Drama") {
      return allMovies.filter(
        (m) =>
          m.categories.includes("Drama") ||
          ["Oppenheimer", "Past Lives", "Parasite", "Drive My Car", "Whiplash"].some((t) =>
            m.title.includes(t),
          ),
      );
    }
    return allMovies;
  }, [allMovies, selectedGenre]);

  return (
    <div className="w-full space-y-10 animate-fadeIn">
      {/* 1. CINEMATIC HERO SPOTLIGHT BANNER WITH COMPLETE CONTENT */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] bg-slate-950">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] min-h-[440px] w-full overflow-hidden">
          {/* Cinema Backdrop */}
          <SafeImage
            src={spotlightMovie.image}
            alt={spotlightMovie.title}
            category="Movies"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
          />

          {/* Cinematic Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

          {/* Ambient Lighting Ribbons */}
          <div className="pointer-events-none absolute -left-20 top-0 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute right-0 bottom-0 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl" />

          {/* Banner Content Container */}
          <div className="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-end text-white max-w-4xl">
            {/* Top Category Badge & Critical Rating */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold tracking-wider uppercase text-[10px] bg-amber-500 text-black shadow-md">
                <Film className="w-3.5 h-3.5 fill-current" />
                Featured Premiere
              </span>

              {spotlightMovie.metadata.rating && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full font-bold text-amber-300 bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  {spotlightMovie.metadata.rating.toFixed(1)} Rating
                </span>
              )}

              {spotlightMovie.metadata.year && (
                <span className="px-3 py-1 rounded-full font-medium text-white/90 bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                  {spotlightMovie.metadata.year}
                </span>
              )}

              <span className="px-3 py-1 rounded-full font-medium text-white/90 bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                2h 46m · IMAX 70mm
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-3 leading-tight drop-shadow-md">
              {spotlightMovie.title}
            </h1>

            {/* Synopsis / Description */}
            <p className="text-xs sm:text-sm lg:text-base text-white/85 mt-3 max-w-2xl leading-relaxed drop-shadow line-clamp-3">
              {spotlightMovie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {/* Watch Trailer */}
              <button
                type="button"
                onClick={() => setSelectedTrailerMovie(spotlightMovie)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-[0_8px_25px_rgba(37,99,235,0.4)] transition active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Official Trailer</span>
              </button>

              {/* Book Tickets */}
              <button
                type="button"
                onClick={() =>
                  handleBookMovieTickets(spotlightMovie.title, spotlightMovie.metadata.year)
                }
                className="flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-md bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow-md"
              >
                <Ticket className="w-4 h-4 text-amber-300" />
                <span>Book Tickets</span>
              </button>

              {/* Save to Watchlist */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-label={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
                className="p-3 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/20 text-white transition active:scale-95 cursor-pointer"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              {/* Share Film */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share movie"
                className="p-3 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/20 text-white transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GENRE / CATEGORY FILTER TABS */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-500 shadow-md"
                    : "bg-white/70 dark:bg-neutral-900/70 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-blue-400"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-slate-400">
          {filteredMovies.length} Box Office Releases
        </span>
      </section>

      {/* 3. GLOBAL BOX OFFICE LEADERBOARD GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500">
              <Clapperboard className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Box Office Leaderboard & Festival Releases
            </h2>
          </div>

          <span className="text-xs font-mono text-slate-400">Verified TMDB Stream</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {filteredMovies.map((movie, index) => (
            <div key={movie.id} className="relative group">
              <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-black/75 backdrop-blur-md text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center border border-white/10 shadow-sm">
                #{index + 1 < 10 ? `0${index + 1}` : index + 1}
              </div>
              <MovieCard item={movie} variant="poster" />
            </div>
          ))}
        </div>
      </section>

      {/* Trailer Modal */}
      {selectedTrailerMovie && (
        <MovieTrailerModal
          item={selectedTrailerMovie}
          onClose={() => setSelectedTrailerMovie(null)}
        />
      )}
    </div>
  );
}
