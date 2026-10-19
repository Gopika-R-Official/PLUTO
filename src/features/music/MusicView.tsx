"use client";

import { MusicCard } from "@/components/content/MusicCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { TiltedCard } from "@/components/ui/TiltedCard";
import { toast } from "@/components/ui/Toast";
import { audioEngine } from "@/lib/audioEngine";
import { MOCK_MUSIC } from "@/lib/mock/music";
import { shareContent } from "@/lib/share";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import {
  Bookmark,
  BookmarkCheck,
  Disc3,
  ExternalLink,
  Headphones,
  Pause,
  Play,
  Radio,
  Share2,
  Volume2,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const MUSIC_GENRES = [
  "All Vinyl",
  "Ambient & Classical",
  "Jazz & Soul",
  "Electronic",
  "Lo-Fi & Beats",
  "Acoustic",
];

export function MusicView() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const [selectedGenre, setSelectedGenre] = useState("All Vinyl");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(
    audioEngine.getPlayingTrackId(),
  );

  useEffect(() => {
    return audioEngine.subscribe((trackId) => {
      setPlayingTrackId(trackId);
    });
  }, []);

  // Spotlight Master Track (Promises by Floating Points & Pharoah Sanders)
  const spotlightTrack: ContentItem = useMemo(() => {
    return MOCK_MUSIC[0] ?? {
      id: "music-spotlight",
      type: "music",
      title: "Promises (Live at Abbey Road)",
      description:
        "A transcendent dialogue between London Symphony Orchestra, Pharoah Sanders' saxophone, and Floating Points' analog synthesizers.",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      categories: ["Music", "Jazz", "Ambient"],
      source: "Bandcamp Weekly",
      url: "https://open.spotify.com/search/Floating%20Points%20Promises",
      publishedAt: "2026-10-14T10:00:00.000Z",
      provenance: "mock",
      metadata: {
        artist: "Floating Points & Pharoah Sanders",
        album: "Promises",
        duration: "46:12",
        playlistHint: "Late Night Focus",
        audioPreview: "/audio/track-1.wav",
      },
    };
  }, []);

  const isSpotlightPlaying = playingTrackId === spotlightTrack.id;
  const isSpotlightSaved = favorites.some((f) => f.id === spotlightTrack.id);

  const handleToggleSpotlightPlayback = async () => {
    if (isSpotlightPlaying) {
      audioEngine.stop();
    } else {
      const ok = await audioEngine.play(
        spotlightTrack.id,
        spotlightTrack.metadata.audioPreview,
      );
      if (!ok) {
        toast.info("Audio preview unavailable for this track.");
      }
    }
  };

  const handleToggleSpotlightFavorite = () => {
    dispatch(toggleFavorite(spotlightTrack));
    toast.success(
      isSpotlightSaved
        ? "Removed from your vinyl shelf"
        : "Added to your vinyl shelf",
    );
  };

  // Filtered tracks based on selected genre
  const filteredTracks = useMemo(() => {
    if (selectedGenre === "All Vinyl") return MOCK_MUSIC;
    if (selectedGenre === "Ambient & Classical") {
      return MOCK_MUSIC.filter(
        (m) =>
          m.categories.includes("Classical") ||
          m.categories.includes("Design") ||
          m.title.includes("Promises") ||
          m.title.includes("Reich"),
      );
    }
    if (selectedGenre === "Jazz & Soul") {
      return MOCK_MUSIC.filter(
        (m) =>
          m.categories.includes("Jazz") ||
          m.title.includes("Promises") ||
          m.title.includes("Tokyo"),
      );
    }
    if (selectedGenre === "Electronic") {
      return MOCK_MUSIC.filter(
        (m) =>
          m.categories.includes("Electronic") ||
          m.categories.includes("Technology") ||
          m.title.includes("Aphex") ||
          m.title.includes("Drukqs"),
      );
    }
    if (selectedGenre === "Lo-Fi & Beats") {
      return MOCK_MUSIC.filter(
        (m) =>
          m.categories.includes("Lifestyle") ||
          m.title.includes("Rain") ||
          m.title.includes("Kyoto"),
      );
    }
    if (selectedGenre === "Acoustic") {
      return MOCK_MUSIC.filter(
        (m) =>
          m.categories.includes("Acoustic") ||
          m.title.includes("Vulture") ||
          m.title.includes("Garden"),
      );
    }
    return MOCK_MUSIC;
  }, [selectedGenre]);

  const savedMusicCount = useMemo(() => {
    return favorites.filter((f) => f.item.type === "music").length;
  }, [favorites]);

  return (
    <div className="space-y-12 sm:space-y-16 w-full animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. MUSIC & VINYL VAULT HEADER                                             */}
      {/* ========================================================================= */}
      <section aria-label="Music Header" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-pink-500/10 text-pink-500 border border-pink-500/20">
                <Headphones className="w-3 h-3" />
                Hi-Fi Listening Room
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {MOCK_MUSIC.length} Studio Masters
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Music & Vinyl Vault
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              Analog synthesizers, orchestral ambient suites, acoustic recordings, and curated vinyl presses with live audio playback.
            </p>
          </div>

          {/* Quick Audio Engine Status Pill */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-[#0c101d]/80 border border-black/[0.06] dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {playingTrackId ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
                  </>
                ) : (
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-400" />
                )}
              </span>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {playingTrackId ? "Stream Active" : "Turntable Ready"}
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              {savedMusicCount} on Vinyl Shelf
            </span>
          </div>
        </div>

        {/* Genre Pill Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {MUSIC_GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              aria-pressed={selectedGenre === genre}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                selectedGenre === genre
                  ? "bg-pink-600 text-white shadow-xs"
                  : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12]"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 3D TURNTABLE VINYL SPOTLIGHT STAGE                                     */}
      {/* ========================================================================= */}
      <section className="relative rounded-[2.5rem] overflow-hidden border border-black/[0.08] dark:border-white/10 bg-gradient-to-br from-neutral-950 via-[#120a16] to-[#1c0e22] text-white p-6 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Album Cover with 3D Turntable Vinyl Record */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-56 h-56 sm:w-68 sm:h-68">
              {/* Spinning Vinyl Record that slides out */}
              <div
                className={`absolute -right-8 -top-2 w-52 h-52 sm:w-64 sm:h-64 rounded-full border-4 border-neutral-700/60 bg-neutral-950 shadow-2xl transition-all duration-700 flex items-center justify-center ${
                  isSpotlightPlaying
                    ? "translate-x-8 sm:translate-x-12 animate-spin"
                    : "group-hover:translate-x-6"
                }`}
                style={{ animationDuration: "5s" }}
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-neutral-800" />
                <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full border border-neutral-700" />
                <div className="absolute w-12 h-12 rounded-full bg-pink-500/90 flex items-center justify-center text-white text-[9px] font-bold shadow-md">
                  PLUTO
                </div>
              </div>

              {/* Sleeve Art with React Bits Tilt */}
              <TiltedCard maxTilt={6} scale={1.02} className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-900">
                <SafeImage
                  src={spotlightTrack.image}
                  alt={spotlightTrack.title}
                  category="Music"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </TiltedCard>
            </div>
          </div>

          {/* Right: Metadata, Controls, Live Waveform */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold tracking-wider uppercase">
                Spotlight Vinyl
              </span>
              <span className="text-xs text-white/60 font-mono">
                {spotlightTrack.metadata.duration} • 48 kHz Master Audio
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {spotlightTrack.title}
              </h2>
              <p className="text-sm font-semibold text-pink-400 mt-1">
                {spotlightTrack.metadata.artist} — {spotlightTrack.metadata.album}
              </p>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                {spotlightTrack.description}
              </p>
            </div>

            {/* Live Audio Visualizer Waveform if Playing */}
            {isSpotlightPlaying && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Playing Preview
                </span>
                <div className="flex items-end gap-1 h-5" aria-label="Audio Visualizer">
                  {[45, 90, 60, 100, 30, 80, 50, 95, 40, 75, 90, 35, 85, 60, 100, 70, 45, 85].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-pink-500 animate-pulse"
                        style={{
                          height: `${h}%`,
                          animationDuration: `${0.3 + (i % 5) * 0.12}s`,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons with MagneticButton */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton
                onClick={handleToggleSpotlightPlayback}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-600/40 transition active:scale-95"
              >
                {isSpotlightPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause Track</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                    <span>Play Audio Preview</span>
                  </>
                )}
              </MagneticButton>

              <a
                href={spotlightTrack.url ?? "https://open.spotify.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition active:scale-95"
              >
                <span>Listen on Spotify</span>
                <ExternalLink className="w-3 h-3 text-pink-300" />
              </a>

              <button
                type="button"
                onClick={handleToggleSpotlightFavorite}
                aria-label={isSpotlightSaved ? "Remove from shelf" : "Save to shelf"}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border transition active:scale-95 text-xs font-semibold cursor-pointer ${
                  isSpotlightSaved
                    ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                    : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                }`}
              >
                {isSpotlightSaved ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-pink-400" />
                    <span>On Vinyl Shelf</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Add to Shelf</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => shareContent(spotlightTrack)}
                aria-label="Share track"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Ambient atmospheric backdrop glow */}
        <div className="pointer-events-none absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-pink-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -top-24 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl" />
      </section>

      {/* ========================================================================= */}
      {/* 3. STUDIO MASTER RELEASES SHELF                                           */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Disc3 className="w-4 h-4 text-pink-500" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {selectedGenre}
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {filteredTracks.length} Studio Releases
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTracks.map((item) => (
            <MusicCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CURATED LISTENING ROOMS (THEMED ARCHIVES)                              */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Curated Listening Sessions
          </h2>
          <span className="text-xs font-semibold text-pink-500">
            Studio Archives
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              id: "session-1",
              title: "Late Night Abbey Road",
              subtitle: "London Symphony & Analog Synthesizers",
              trackCount: "8 Master Cuts",
              image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "session-2",
              title: "Tokyo City Pop & Jazz Heritage",
              subtitle: "Pacific Ambient, Marimbas & Tape Flutters",
              trackCount: "12 Master Cuts",
              image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "session-3",
              title: "Monastic Minimalist Studies",
              subtitle: "Steve Reich & Prepared Piano Works",
              trackCount: "6 Master Cuts",
              image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
            },
          ].map((room) => (
            <div
              key={room.id}
              onClick={() => toast.info(`Loaded "${room.title}" session`)}
              className="group relative rounded-3xl overflow-hidden aspect-[16/10] border border-black/[0.06] dark:border-white/10 bg-neutral-950 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <SafeImage
                src={room.image}
                alt={room.title}
                category="Music"
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/20 text-white border border-white/20">
                {room.trackCount}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition">
                  {room.title}
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                  {room.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HI-FI PROVENANCE ENGINE BANNER                                         */}
      {/* ========================================================================= */}
      <section className="rounded-3xl p-6 sm:p-7 backdrop-blur-xl bg-white/70 dark:bg-[#0c101d]/80 border border-black/[0.06] dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pink-500/10 text-pink-500 border border-pink-500/20">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Authentic Streaming Engine
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-xl">
              Pluto plays genuine local WAV audio previews with strict single-stream playback, soundwave simulation, and direct one-click links to full Spotify releases.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[11px] font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
          HTML5 Web Audio • 48 kHz
        </span>
      </section>
    </div>
  );
}
