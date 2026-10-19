"use client";

import { INTERESTS } from "@/lib/constants";
import { toast } from "@/components/ui/Toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutAuth, updateAuthUser } from "@/store/slices/authSlice";
import { resetLayout } from "@/store/slices/layoutSlice";
import {
  resetPersonalization,
  setDisplayName,
  toggleFollowTopic,
  toggleInterest,
} from "@/store/slices/preferencesSlice";
import { setTheme } from "@/store/slices/themeSlice";
import {
  Check,
  Globe,
  Loader2,
  LogIn,
  LogOut,
  ShieldCheck,
  Sliders,
  Sparkles,
  SunMoon,
  Tag,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CURATED_AVATARS = [
  { id: "1", label: "Editorial", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
  { id: "2", label: "Architect", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { id: "3", label: "Sonic", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
  { id: "4", label: "Cinema", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80" },
];

export function SettingsView() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const theme = useAppSelector((state) => state.theme.mode);
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [nameInput, setNameInput] = useState(authUser?.name || preferences.displayName || "Alex Rao");
  const [bioInput, setBioInput] = useState(authUser?.bio || "Culture & Cinema Explorer");
  const [selectedAvatar, setSelectedAvatar] = useState(authUser?.avatar || CURATED_AVATARS[0].url);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    dispatch(setDisplayName(nameInput.trim()));

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameInput.trim(),
            bio: bioInput.trim(),
            avatar: selectedAvatar,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(updateAuthUser(data.user));
          toast.success("Profile saved and synchronized to Pluto server");
        } else {
          toast.success("Profile saved locally");
        }
      } catch {
        toast.success("Profile saved locally");
      }
    } else {
      toast.success("Profile name updated locally");
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue
    }
    dispatch(logoutAuth());
    toast.info("Signed out of Pluto");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 animate-fadeIn">
      {/* Header */}
      <header className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm sm:p-10 card-tactile">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-[var(--theme-accent)]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full opacity-10 blur-3xl bg-[var(--theme-highlight)]" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-[var(--muted)]">
              <Sliders className="h-3.5 w-3.5" />
              SYSTEM PREFERENCES · MEMBER IDENTITY
            </span>
            {isAuthenticated ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Member</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                <Globe className="w-3 h-3" />
                <span>Guest Mode</span>
              </span>
            )}
          </div>

          <h1 className="editorial mt-3 text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-6xl">
            Preferences & Identity
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Manage your authenticated member profile, visual atmosphere palette, and algorithmic signal spectrum.
          </p>
        </div>
      </header>

      {/* Account Profile Card */}
      <section className="rounded-[2.2rem] border border-[var(--border)] bg-[var(--card)] p-7 sm:p-8 shadow-sm card-tactile">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
              <User className="h-4 w-4" />
            </span>
            <div>
              <h2 className="editorial text-2xl font-bold text-[var(--fg)]">Profile Identity</h2>
              <p className="text-xs text-[var(--muted)]">
                {isAuthenticated
                  ? `Signed in as ${authUser?.email}`
                  : "Sign in to synchronize your profile and archives across devices."}
              </p>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--theme-accent)] text-white text-xs font-semibold shadow-xs hover:opacity-90 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card-strong)] text-[var(--fg)] text-xs font-semibold hover:border-[var(--theme-accent)] transition"
              >
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Profile Editing Form */}
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
          {/* Avatar selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Curated Member Avatars
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {CURATED_AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.url)}
                    className={`relative rounded-full p-1 transition-transform cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[var(--theme-accent)] scale-105"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar.url}
                      alt={avatar.label}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute bottom-0 right-0 grid h-4 w-4 place-items-center rounded-full bg-[var(--theme-accent)] text-white text-[9px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="display-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Display Name
              </label>
              <input
                id="display-name"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="e.g. Alex Rao"
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-bio" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Curator Motto / Bio
              </label>
              <input
                id="profile-bio"
                value={bioInput}
                onChange={(event) => setBioInput(event.target.value)}
                placeholder="Cinema, sonic architectures, and cultural archives"
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] transition"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--theme-accent)] hover:opacity-90 text-white text-xs font-semibold shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Profile Updates</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Theme Appearance Mode */}
      <section className="rounded-[2.2rem] border border-[var(--border)] bg-[var(--card)] p-7 sm:p-8 shadow-sm card-tactile">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
            <SunMoon className="h-4 w-4" />
          </span>
          <h2 className="editorial text-2xl font-bold text-[var(--fg)]">Theme Mode</h2>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Toggle between the rich warm editorial parchment canvas and deep obsidian dark mode.
        </p>

        <div className="mt-5 flex gap-2.5">
          {(["light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => dispatch(setTheme(mode))}
              className={`rounded-2xl px-5 py-2.5 text-xs font-semibold capitalize transition cursor-pointer ${
                theme === mode
                  ? "bg-[var(--fg)] text-[var(--bg)] shadow-sm"
                  : "bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--chip-hover)]"
              }`}
            >
              {mode === "light" ? "Warm Parchment Light" : "Cosmic Obsidian Dark"}
            </button>
          ))}
        </div>
      </section>

      {/* Core Interests Spectrum */}
      <section className="rounded-[2.2rem] border border-[var(--border)] bg-[var(--card)] p-7 sm:p-8 shadow-sm card-tactile">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
            <Tag className="h-4 w-4" />
          </span>
          <h2 className="editorial text-2xl font-bold text-[var(--fg)]">Interests Spectrum</h2>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Selected categories receive baseline priority score boost across your discovery feed.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const active = preferences.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => dispatch(toggleInterest(interest))}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-[var(--theme-accent)] text-white shadow-xs"
                    : "bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--chip-hover)]"
                }`}
              >
                {interest}
                {active && <span className="ml-1.5 opacity-80">✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Followed Topic Streams */}
      <section className="rounded-[2.2rem] border border-[var(--border)] bg-[var(--card)] p-7 sm:p-8 shadow-sm card-tactile">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/15 text-purple-500">
            <Zap className="h-4 w-4" />
          </span>
          <h2 className="editorial text-2xl font-bold text-[var(--fg)]">Followed Streams</h2>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Followed topics receive continuous background prioritization in dispatches and trending.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {INTERESTS.map((topic) => {
            const followed = preferences.followedTopics.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => dispatch(toggleFollowTopic(topic))}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  followed
                    ? "bg-[var(--fg)] text-[var(--bg)] shadow-xs"
                    : "bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--chip-hover)]"
                }`}
              >
                {topic}
                {followed && <span className="ml-1.5 text-xs opacity-75">★</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Reset & Maintenance */}
      <section className="rounded-[2.2rem] border border-[var(--border)] bg-[var(--card)] p-7 sm:p-8 shadow-sm card-tactile">
        <h2 className="editorial text-2xl font-bold text-rose-600 dark:text-rose-400">
          Reset Architecture
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Restore default algorithmic preferences or reset feed layout sequence.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              dispatch(resetPersonalization());
              toast.info("Personalization reset to defaults");
            }}
            className="rounded-2xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--chip)] transition cursor-pointer"
          >
            Reset Signal Scoring
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(resetLayout());
              toast.info("Feed layout restored to default sequence");
            }}
            className="rounded-2xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--chip)] transition cursor-pointer"
          >
            Reset Discovery Modules
          </button>
        </div>
      </section>
    </div>
  );
}
