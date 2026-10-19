import type { Interest } from "./types";

export interface ThemeAtmosphere {
  id: string;
  label: string;
  tagline: string;
  primaryInterest: Interest | "Default";
  accent: string;
  accentHover: string;
  accentSecondary: string;
  accentMuted: string;
  accentGlow: string;
  gradient: string;
  surfaceGlow: string;
  badgeBg: string;
  badgeFg: string;
  darkSurface: string;
  darkBorder: string;
}

export const ATMOSPHERES: Record<string, ThemeAtmosphere> = {
  tech: {
    id: "tech",
    label: "Cyber Indigo",
    tagline: "Precision, deep tech & future systems",
    primaryInterest: "Technology",
    accent: "#38bdf8", // electric cyan
    accentHover: "#0ea5e9",
    accentSecondary: "#6366f1", // indigo
    accentMuted: "rgba(56, 189, 248, 0.14)",
    accentGlow: "rgba(56, 189, 248, 0.28)",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    surfaceGlow: "rgba(14, 165, 233, 0.08)",
    badgeBg: "rgba(56, 189, 248, 0.12)",
    badgeFg: "#0284c7",
    darkSurface: "#0f172a",
    darkBorder: "rgba(56, 189, 248, 0.2)",
  },
  cinema: {
    id: "cinema",
    label: "Cinematic Amber",
    tagline: "Film reels, moody theater & warm spotlight",
    primaryInterest: "Movies",
    accent: "#f59e0b", // warm amber
    accentHover: "#d97706",
    accentSecondary: "#e11d48", // rose/burgundy
    accentMuted: "rgba(245, 158, 11, 0.14)",
    accentGlow: "rgba(245, 158, 11, 0.32)",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)",
    surfaceGlow: "rgba(245, 158, 11, 0.08)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeFg: "#b45309",
    darkSurface: "#1a1412",
    darkBorder: "rgba(245, 158, 11, 0.25)",
  },
  music: {
    id: "music",
    label: "Electric Coral",
    tagline: "Deep rhythms, vinyl warmth & live stages",
    primaryInterest: "Music",
    accent: "#ec4899", // vibrant pink/magenta
    accentHover: "#db2777",
    accentSecondary: "#8b5cf6", // violet
    accentMuted: "rgba(236, 72, 153, 0.14)",
    accentGlow: "rgba(236, 72, 153, 0.3)",
    gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    surfaceGlow: "rgba(236, 72, 153, 0.08)",
    badgeBg: "rgba(236, 72, 153, 0.14)",
    badgeFg: "#be185d",
    darkSurface: "#190f1d",
    darkBorder: "rgba(236, 72, 153, 0.22)",
  },
  travel: {
    id: "travel",
    label: "Forest & Horizon",
    tagline: "Coastal tides, pine horizons & wanderlust",
    primaryInterest: "Travel",
    accent: "#10b981", // emerald
    accentHover: "#059669",
    accentSecondary: "#06b6d4", // cyan
    accentMuted: "rgba(16, 185, 129, 0.14)",
    accentGlow: "rgba(16, 185, 129, 0.28)",
    gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    surfaceGlow: "rgba(16, 185, 129, 0.08)",
    badgeBg: "rgba(16, 185, 129, 0.14)",
    badgeFg: "#047857",
    darkSurface: "#0c1815",
    darkBorder: "rgba(16, 185, 129, 0.22)",
  },
  finance: {
    id: "finance",
    label: "Midnight Emerald",
    tagline: "High-conviction capital, macro markets & strategy",
    primaryInterest: "Business",
    accent: "#14b8a6", // teal
    accentHover: "#0d9488",
    accentSecondary: "#3b82f6", // blue
    accentMuted: "rgba(20, 184, 166, 0.14)",
    accentGlow: "rgba(20, 184, 166, 0.28)",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)",
    surfaceGlow: "rgba(20, 184, 166, 0.08)",
    badgeBg: "rgba(20, 184, 166, 0.14)",
    badgeFg: "#0f766e",
    darkSurface: "#0c1a1a",
    darkBorder: "rgba(20, 184, 166, 0.22)",
  },
  design: {
    id: "design",
    label: "Nordic Lavender",
    tagline: "Editorial craft, typography & thoughtful aesthetics",
    primaryInterest: "Design",
    accent: "#8b5cf6", // violet
    accentHover: "#7c3aed",
    accentSecondary: "#c084fc", // lavender
    accentMuted: "rgba(139, 92, 246, 0.14)",
    accentGlow: "rgba(139, 92, 246, 0.3)",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)",
    surfaceGlow: "rgba(139, 92, 246, 0.08)",
    badgeBg: "rgba(139, 92, 246, 0.14)",
    badgeFg: "#6d28d9",
    darkSurface: "#161324",
    darkBorder: "rgba(139, 92, 246, 0.22)",
  },
  editorial: {
    id: "editorial",
    label: "Oxblood & Champagne",
    tagline: "Rich burgundy, warm parchment & editorial sculpture",
    primaryInterest: "Design",
    accent: "#722C3A",
    accentHover: "#5A222E",
    accentSecondary: "#C86E63",
    accentMuted: "rgba(114, 44, 58, 0.12)",
    accentGlow: "rgba(114, 44, 58, 0.25)",
    gradient: "linear-gradient(135deg, #722C3A 0%, #C86E63 100%)",
    surfaceGlow: "rgba(114, 44, 58, 0.08)",
    badgeBg: "rgba(114, 44, 58, 0.12)",
    badgeFg: "#722C3A",
    darkSurface: "#1a1215",
    darkBorder: "rgba(114, 44, 58, 0.25)",
  },
};

export const DEFAULT_ATMOSPHERE = ATMOSPHERES.editorial;

const INTEREST_TO_ATMOSPHERE: Record<Interest, string> = {
  Technology: "tech",
  Science: "tech",
  Gaming: "tech",
  Movies: "cinema",
  Music: "music",
  Travel: "travel",
  Lifestyle: "travel",
  Business: "finance",
  Finance: "finance",
  Design: "design",
  Sports: "tech",
  Social: "design",
};

export function resolveAtmosphere(
  interests: Interest[],
  manualOverride?: string | null,
): ThemeAtmosphere {
  if (manualOverride && ATMOSPHERES[manualOverride]) {
    return ATMOSPHERES[manualOverride];
  }

  if (interests.length === 0) {
    return DEFAULT_ATMOSPHERE;
  }

  // Pick the first selected interest's mapping as primary
  let primaryKey: string | null = null;
  for (const interest of interests) {
    const key = INTEREST_TO_ATMOSPHERE[interest];
    if (key && ATMOSPHERES[key]) {
      primaryKey = key;
      break;
    }
  }

  if (!primaryKey) return DEFAULT_ATMOSPHERE;
  const base = ATMOSPHERES[primaryKey];

  // If a secondary distinct atmosphere exists from remaining interests, blend!
  let secondaryKey: string | null = null;
  for (let i = 1; i < interests.length; i++) {
    const key = INTEREST_TO_ATMOSPHERE[interests[i]];
    if (key && ATMOSPHERES[key] && key !== primaryKey) {
      secondaryKey = key;
      break;
    }
  }

  if (secondaryKey) {
    const secondary = ATMOSPHERES[secondaryKey];
    return {
      ...base,
      accentSecondary: secondary.accent,
      gradient: `linear-gradient(135deg, ${base.accent} 0%, ${secondary.accent} 100%)`,
      tagline: `${base.primaryInterest} & ${secondary.primaryInterest} synthesis`,
    };
  }

  return base;
}
