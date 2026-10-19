"use client";

import { MovieCard } from "@/components/content/MovieCard";
import { MovieTrailerModal } from "@/components/content/MovieTrailerModal";
import { MusicCard } from "@/components/content/MusicCard";
import { NewsCard } from "@/components/content/NewsCard";
import { RestaurantCard } from "@/components/content/RestaurantCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltedCard } from "@/components/ui/TiltedCard";
import { toast } from "@/components/ui/Toast";
import type { ContentItem } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDisplayName } from "@/store/slices/preferencesSlice";
import {
  Bookmark,
  Compass,
  Edit2,
  FolderPlus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type MySpaceTab = "collections" | "saved" | "history";
type SavedFilter = "all" | "movie" | "news" | "music" | "restaurant";

interface UserCollection {
  id: string;
  name: string;
  itemCount: number;
  coverImage: string;
  category: string;
}

const DEFAULT_COLLECTIONS: UserCollection[] = [
  {
    id: "col-1",
    name: "Sci-Fi Cinema Vault",
    itemCount: 12,
    coverImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    category: "Cinema",
  },
  {
    id: "col-2",
    name: "Neural & Deep Tech",
    itemCount: 8,
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    category: "Technology",
  },
  {
    id: "col-3",
    name: "Travel Horizons",
    itemCount: 6,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    category: "Travel",
  },
  {
    id: "col-4",
    name: "Ambient & Vinyl Stacks",
    itemCount: 14,
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    category: "Vinyl",
  },
];

const EXPLORATION_HISTORY = [
  {
    id: "hist-1",
    type: "movie" as const,
    title: "Interstellar",
    subtitle: "Movie · 2014",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
  },
  {
    id: "hist-2",
    type: "news" as const,
    title: "The Verge: AI Reasoning",
    subtitle: "Tech Dispatch · 2h ago",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    url: "https://theverge.com",
  },
  {
    id: "hist-3",
    type: "music" as const,
    title: "Promises (Live at Abbey Road)",
    subtitle: "Artist · Floating Points",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    url: "https://open.spotify.com",
  },
  {
    id: "hist-4",
    type: "restaurant" as const,
    title: "The Ivy Mumbai",
    subtitle: "Culinary Sanctuary · BKC",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    url: "https://www.zomato.com",
  },
];

export function MySpaceView() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favorites = useAppSelector((state) => state.favorites.items);

  const [activeTab, setActiveTab] = useState<MySpaceTab>("collections");
  const [savedFilter, setSavedFilter] = useState<SavedFilter>("all");
  const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<ContentItem | null>(null);

  const [collections, setCollections] = useState<UserCollection[]>(() => {
    if (typeof window === "undefined") return DEFAULT_COLLECTIONS;
    try {
      const stored = localStorage.getItem("pluto_user_collections");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_COLLECTIONS;
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState(preferences.displayName || "Alex Rao");
  const [profileBio, setProfileBio] = useState<string>(() => {
    if (typeof window === "undefined") return "Curator of culture, cinema & sound";
    try {
      const stored = localStorage.getItem("pluto_user_bio");
      if (stored) return stored;
    } catch {
      // ignore
    }
    return "Curator of culture, cinema & sound";
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionCategory, setNewCollectionCategory] = useState("Cinema");

  const saveCollections = (items: UserCollection[]) => {
    setCollections(items);
    try {
      localStorage.setItem("pluto_user_collections", JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const newCol: UserCollection = {
      id: `col-${Date.now()}`,
      name: newCollectionName.trim(),
      itemCount: 0,
      coverImage:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      category: newCollectionCategory,
    };

    const updated = [newCol, ...collections];
    saveCollections(updated);
    setNewCollectionName("");
    setShowCreateModal(false);
    toast.success(`Created collection "${newCol.name}"`);
  };

  const handleDeleteCollection = (id: string, name: string) => {
    const updated = collections.filter((c) => c.id !== id);
    saveCollections(updated);
    toast.info(`Deleted collection "${name}"`);
  };

  const handleSaveProfile = () => {
    if (profileNameInput.trim()) {
      dispatch(setDisplayName(profileNameInput.trim()));
    }
    try {
      localStorage.setItem("pluto_user_bio", profileBio.trim());
    } catch {
      // ignore
    }
    setIsEditingProfile(false);
    toast.success("Profile updated");
  };

  // Filter saved favorites
  const filteredFavorites = favorites.filter((fav) => {
    if (savedFilter === "all") return true;
    return fav.item.type === savedFilter;
  });

  return (
    <div className="space-y-12 sm:space-y-16 w-full animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. PERSONAL SANCTUARY HEADER                                              */}
      {/* ========================================================================= */}
      <section aria-label="Personal Sanctuary Header" className="w-full">
        <SpotlightCard className="p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Luminous Avatar Frame */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-white dark:border-[#0c101d]">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt={preferences.displayName || "Alex Rao"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c101d]" />
              </div>

              {/* User Bio & Identity */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                    Personal Library
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Member Archive
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  {preferences.displayName || "Alex Rao"}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-md">
                  {profileBio}
                </p>
              </div>
            </div>

            {/* Profile Action & Edit Trigger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditingProfile((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md bg-black/[0.04] dark:bg-white/10 hover:bg-black/[0.08] dark:hover:bg-white/15 border border-black/[0.08] dark:border-white/15 text-neutral-800 dark:text-white transition shadow-xs cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? "Close" : "Edit Profile"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>New Collection</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Inline Drawer */}
          {isEditingProfile && (
            <div className="relative z-10 mt-6 p-5 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Update Profile Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileNameInput}
                    onChange={(e) => setProfileNameInput(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-black/50 border border-black/[0.08] dark:border-white/15 text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Personal Motto
                  </label>
                  <input
                    type="text"
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Personal motto"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-black/50 border border-black/[0.08] dark:border-white/15 text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* 3 Core Library Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-black/[0.06] dark:border-white/10 text-center">
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
              <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {collections.length}
              </span>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Collections
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
              <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {favorites.length}
              </span>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Saved Items
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
              <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {preferences.interests.length}
              </span>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Focus Topics
              </span>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* ========================================================================= */}
      {/* 2. REFINED NAVIGATION TABS                                                */}
      {/* ========================================================================= */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex p-1.5 rounded-full backdrop-blur-xl bg-white/70 dark:bg-[#0c101d]/85 border border-black/[0.06] dark:border-white/10 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("collections")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none cursor-pointer ${
              activeTab === "collections"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Collections ({collections.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none cursor-pointer ${
              activeTab === "saved"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Saved Archive ({favorites.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none cursor-pointer ${
              activeTab === "history"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Session History
          </button>
        </div>

        {/* Create Collection CTA */}
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>
      </section>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: COLLECTIONS GRID                                          */}
      {/* ========================================================================= */}
      {activeTab === "collections" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              My Curated Shelves
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              {collections.length} Curated Shelves
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <TiltedCard key={col.id} maxTilt={6} scale={1.02} className="rounded-3xl">
                <div className="group relative rounded-3xl overflow-hidden aspect-[4/3] border border-black/[0.06] dark:border-white/10 shadow-md hover:shadow-2xl transition-all duration-300 bg-neutral-950 cursor-pointer">
                  {/* Background Artwork */}
                  <SafeImage
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Top Category Badge & Delete */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-white/20 text-white border border-white/20">
                      {col.category}
                    </span>

                    {col.id.startsWith("col-") && !["col-1", "col-2", "col-3", "col-4"].includes(col.id) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(col.id, col.name);
                        }}
                        className="p-1.5 rounded-full bg-black/50 text-white/70 hover:text-red-400 hover:bg-black/80 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Bottom Title & Item Count */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition">
                      {col.name}
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5 font-medium">
                      {col.itemCount} Curated Items
                    </p>
                  </div>
                </div>
              </TiltedCard>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: SAVED ARCHIVE (FAVORITES)                                  */}
      {/* ========================================================================= */}
      {activeTab === "saved" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Preserved Library Artifacts ({favorites.length})
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Locally synchronized archive across movies, dispatches, records, and dining
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Items" },
                { id: "movie", label: "Cinema" },
                { id: "news", label: "Dispatches" },
                { id: "music", label: "Vinyl" },
                { id: "restaurant", label: "Dining" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSavedFilter(f.id as SavedFilter)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    savedFilter === f.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="rounded-3xl p-12 text-center backdrop-blur-2xl bg-white/60 dark:bg-[#0c101c]/60 border border-black/[0.06] dark:border-white/10 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Your private library is empty
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                Explore Pluto’s cinematic catalog, vinyl soundstage, or dining sanctuaries and tap the bookmark icon on any item to preserve it here.
              </p>
              <div className="pt-2">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Discover Feed</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFavorites.map((fav) => (
                <div key={fav.id} className="relative">
                  {fav.item.type === "restaurant" ? (
                    <RestaurantCard item={fav.item} />
                  ) : fav.item.type === "movie" ? (
                    <MovieCard item={fav.item} variant="compact" />
                  ) : fav.item.type === "music" ? (
                    <MusicCard item={fav.item} />
                  ) : (
                    <NewsCard item={fav.item} variant="editorial" />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: SESSION HISTORY                                           */}
      {/* ========================================================================= */}
      {activeTab === "history" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Exploration Footprint
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Recent articles, trailers, and tracks opened during this session
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Session Activity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPLORATION_HISTORY.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === "movie") {
                    setSelectedTrailerMovie({
                      id: item.id,
                      type: "movie",
                      title: item.title,
                      description: "Interstellar cinematic odyssey.",
                      image: item.image,
                      categories: ["Movies"],
                      source: "Pluto",
                      publishedAt: "2014-11-05T00:00:00.000Z",
                      provenance: "mock",
                      url: item.url,
                      metadata: { trailerKey: "zSWdZVtXT7E" },
                    });
                  } else {
                    window.open(item.url, "_blank", "noopener,noreferrer");
                  }
                }}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] border border-black/[0.06] dark:border-white/10 bg-neutral-950 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/20 text-white border border-white/20">
                  {item.type}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl p-6 backdrop-blur-2xl bg-white dark:bg-[#0c101c] border border-black/[0.08] dark:border-white/15 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Create New Curated Shelf
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Group cinema releases, vinyl cuts, and dispatches in a dedicated shelf.
            </p>

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. Midnight Sci-Fi, Summer Reading"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/15 text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Category Tag
                </label>
                <select
                  value={newCollectionCategory}
                  onChange={(e) => setNewCollectionCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/15 text-sm text-neutral-900 dark:text-white outline-none"
                >
                  <option value="Cinema">Cinema</option>
                  <option value="Technology">Technology</option>
                  <option value="Vinyl">Vinyl</option>
                  <option value="Travel">Travel</option>
                  <option value="Gastronomy">Gastronomy</option>
                  <option value="Art & Design">Art & Design</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Create Shelf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
