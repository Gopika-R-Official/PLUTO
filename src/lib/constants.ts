import type { FeedModuleId, Interest, Vibe } from "./types";

export const APP_NAME = "Pluto";

export const INTERESTS: Interest[] = [
  "Technology",
  "Science",
  "Movies",
  "Music",
  "Sports",
  "Finance",
  "Travel",
  "Gaming",
  "Social",
  "Business",
  "Design",
  "Lifestyle",
];

export const SUGGESTED_INTERESTS: Interest[] = [
  "Technology",
  "Science",
  "Movies",
  "Music",
  "Sports",
  "Finance",
  "Travel",
  "Gaming",
  "Social",
];

export const DEFAULT_FEED_ORDER: FeedModuleId[] = [
  "featured",
  "topics",
  "movies",
  "news",
  "music",
  "social",
  "myspace",
  "together",
];

export const VIBES: {
  id: Vibe;
  label: string;
  description: string;
}[] = [
  { id: "unwind", label: "Unwind", description: "Soft lighting, slower stories, quiet corners." },
  { id: "feel-good", label: "Feel-good", description: "Warm films, bright playlists, easy company." },
  { id: "curious", label: "Curious", description: "Essays, science, documentaries, new ideas." },
  { id: "focused", label: "Focused", description: "Deep work scores, long reads, fewer distractions." },
  { id: "adventure", label: "Adventure", description: "Outings, events, travel notes, weekend energy." },
  { id: "surprise", label: "Surprise me", description: "A mixed set across moods — still explainable." },
];

export const STORAGE_KEYS = {
  theme: "pluto.theme",
  preferences: "pluto.preferences",
  favorites: "pluto.favorites",
  layout: "pluto.layout",
  together: "pluto.together",
  myspace: "pluto.myspace",
  activities: "pluto.activities",
} as const;

export const YOU: { id: string; name: string; initials: string; isYou: true } = {
  id: "you",
  name: "Alex Rao",
  initials: "AR",
  isYou: true,
};

export const SIGNAL_WEIGHTS = {
  interest: 3,
  followed: 1.4,
  favorite: 2.2,
  opened: 0.7,
  boost: 1,
  dismiss: -8,
} as const;

export const TOPIC_BOOST_CAP = 6;
export const MAX_OPEN_SIGNAL = 3;
