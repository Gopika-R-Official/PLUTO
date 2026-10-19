"use client";

import { SpotlightTile } from "@/components/ui/SpotlightTile";
import { toast } from "@/components/ui/Toast";
import type { Interest } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { completeOnboarding } from "@/store/slices/preferencesSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Atom,
  ChevronRight,
  Compass,
  Cpu,
  Disc3,
  Film,
  Gamepad2,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CategoryMeta {
  id: Interest;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

const CATEGORY_ITEMS: CategoryMeta[] = [
  {
    id: "Technology",
    title: "Technology",
    description: "AI, engineering breakthroughs, architecture, and deep tech.",
    icon: <Cpu className="h-5 w-5" />,
    badge: "Frontier",
  },
  {
    id: "Science",
    title: "Science",
    description: "Cosmology, laboratory research, climate, and discoveries.",
    icon: <Atom className="h-5 w-5" />,
    badge: "Research",
  },
  {
    id: "Movies",
    title: "Movies",
    description: "Festival premieres, trailers, cinema analysis, and box office.",
    icon: <Film className="h-5 w-5" />,
    badge: "Cinema",
  },
  {
    id: "Music",
    title: "Music",
    description: "Sonic curation, audio previews, vinyl releases, and acoustics.",
    icon: <Disc3 className="h-5 w-5" />,
    badge: "Audio",
  },
  {
    id: "Sports",
    title: "Sports",
    description: "Match tactics, athletics, competitive history, and analytics.",
    icon: <Trophy className="h-5 w-5" />,
    badge: "Arena",
  },
  {
    id: "Finance",
    title: "Finance",
    description: "Global macro, venture capital, fintech, and market shifts.",
    icon: <TrendingUp className="h-5 w-5" />,
    badge: "Markets",
  },
  {
    id: "Travel",
    title: "Travel",
    description: "Slow journeys, city dispatches, expeditions, and cultural routes.",
    icon: <Compass className="h-5 w-5" />,
    badge: "Explore",
  },
  {
    id: "Gaming",
    title: "Gaming",
    description: "Interactive narrative, indie studios, mechanics, and design.",
    icon: <Gamepad2 className="h-5 w-5" />,
    badge: "Play",
  },
  {
    id: "Social",
    title: "Social",
    description: "Community voices, member discussions, and shared tables.",
    icon: <MessageSquare className="h-5 w-5" />,
    badge: "Circle",
  },
];

interface OnboardingProps {
  forceVisible?: boolean;
  onFinished?: () => void;
}

export function Onboarding({ forceVisible = false, onFinished }: OnboardingProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const preferences = useAppSelector((state) => state.preferences);

  // If already complete and not force-rendered, don't show
  const isComplete = preferences.onboardingComplete || preferences.onboardingCompleted;

  const [name, setName] = useState(preferences.displayName || "");
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(
    preferences.interests.length > 0 ? preferences.interests : ["Technology"],
  );

  const [nameError, setNameError] = useState<string | null>(null);
  const [interestError, setInterestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isComplete && !forceVisible) {
    return null;
  }

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];
      if (updated.length > 0) {
        setInterestError(null);
      }
      return updated;
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (val.trim()) {
      setNameError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    let hasError = false;

    // Validate Display Name
    if (!trimmedName) {
      setNameError("Display name is required. Please tell us what to call you.");
      hasError = true;
    } else if (trimmedName.length < 2) {
      setNameError("Display name must be at least 2 characters.");
      hasError = true;
    } else {
      setNameError(null);
    }

    // Validate Interests (at least 1 required)
    if (selectedInterests.length === 0) {
      setInterestError("Please select at least one interest to personalize your feed.");
      hasError = true;
    } else {
      setInterestError(null);
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    // Save profile and preferences to Redux (which auto-persists to localStorage)
    dispatch(
      completeOnboarding({
        displayName: trimmedName,
        interests: selectedInterests,
      }),
    );

    toast.success(`Welcome to Pluto, ${trimmedName}! Your personalized radar is ready.`);

    if (onFinished) {
      onFinished();
    } else {
      router.push("/");
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-6 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-heading"
        aria-describedby="onboarding-description"
      >
        {/* React Bits-inspired ambient CSS aurora glow */}
        <div
          className="pointer-events-none fixed inset-0 opacity-40 dark:opacity-25"
          style={{
            background:
              "radial-gradient(circle at 50% 15%, var(--theme-accent, #6366f1) 0%, transparent 60%), radial-gradient(circle at 85% 75%, #ec4899 0%, transparent 50%), radial-gradient(circle at 15% 85%, #06b6d4 0%, transparent 50%)",
            filter: "blur(70px)",
          }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 my-auto w-full max-w-3xl rounded-[2rem] sm:rounded-[2.5rem] border border-border bg-card p-6 sm:p-10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-border/80 pb-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-chip px-3 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                <Sparkles className="h-3 w-3 text-[var(--theme-accent,#6366f1)]" />
                Welcome to Pluto · Personal Setup
              </span>
            </div>
            <h1
              id="onboarding-heading"
              className="editorial text-3xl sm:text-4xl font-bold tracking-tight text-fg"
            >
              Shape Your Discovery Radar
            </h1>
            <p id="onboarding-description" className="text-sm text-muted leading-relaxed max-w-xl">
              Tell us who you are and choose the themes that matter to you. Your feed,
              recommendations, and ambient atmosphere personalize immediately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6 sm:space-y-8" noValidate>
            {/* Step 1: Display Name */}
            <div className="space-y-2">
              <label
                htmlFor="onboarding-display-name"
                className="block text-xs font-bold uppercase tracking-wider text-fg"
              >
                1. Your Display Name <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-muted">
                How you appear across your dashboard, shared lounges, and notes.
              </p>
              <div className="relative max-w-md">
                <input
                  id="onboarding-display-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Alex Rao"
                  aria-required="true"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "onboarding-name-error" : undefined}
                  autoComplete="name"
                  className={`h-12 w-full rounded-2xl border bg-bg px-4 text-base sm:text-sm font-medium text-fg placeholder:text-muted/60 transition focus:outline-none focus:ring-2 ${
                    nameError
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-border focus:border-[var(--theme-accent,#6366f1)] focus:ring-[var(--theme-accent-glow,rgba(99,102,241,0.2))]"
                  }`}
                />
              </div>
              {nameError && (
                <p
                  id="onboarding-name-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-500 pt-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            {/* Step 2: Choose Interests */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-fg">
                    2. Select Your Core Interests <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-xs text-muted">
                    Pick at least one category to tune your news, cinema, and social stream.
                  </p>
                </div>
                <span
                  className={`text-xs font-mono font-semibold ${
                    selectedInterests.length > 0 ? "text-[var(--theme-accent,#6366f1)]" : "text-muted"
                  }`}
                  aria-live="polite"
                >
                  {selectedInterests.length} selected
                </span>
              </div>

              {interestError && (
                <p
                  role="alert"
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-500"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{interestError}</span>
                </p>
              )}

              {/* 9 Category Spotlight Tiles */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 pt-1"
                role="group"
                aria-label="Core interest categories"
              >
                {CATEGORY_ITEMS.map((cat) => (
                  <SpotlightTile
                    key={cat.id}
                    id={cat.id}
                    title={cat.title}
                    description={cat.description}
                    icon={cat.icon}
                    badge={cat.badge}
                    selected={selectedInterests.includes(cat.id)}
                    onToggle={toggleInterest}
                  />
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-6">
              <div className="text-xs text-muted">
                <span className="font-semibold text-fg">Privacy note:</span> Your preferences stay
                stored locally on this device.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[var(--theme-accent,#6366f1)] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--theme-accent-glow,rgba(99,102,241,0.25))] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent,#6366f1)] focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50"
              >
                <span>Enter Discovery Radar</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
