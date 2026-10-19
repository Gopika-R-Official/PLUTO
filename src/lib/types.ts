export const CONTENT_TYPES = [
  "news",
  "movie",
  "social",
  "music",
  "activity",
  "place",
  "restaurant",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export type DataProvenance = "live" | "mock";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image: string | null;
  categories: string[];
  source: string;
  url: string | null;
  publishedAt: string | null;
  provenance: DataProvenance;
  metadata: ContentMetadata;
}

export interface ContentMetadata {
  author?: string;
  handle?: string;
  likes?: number;
  comments?: number;
  rating?: number;
  year?: number;
  runtime?: number;
  genreIds?: number[];
  trailerUrl?: string;
  trailerKey?: string | null;
  artist?: string;
  album?: string;
  duration?: string;
  audioPreview?: string | null;
  dateLabel?: string;
  locationLabel?: string;
  location?: string;
  cost?: "free" | "budget" | "flexible";
  company?: "alone" | "friends" | "family";
  setting?: "home" | "out";
  playlistHint?: string;
  cuisine?: string;
  reservationUrl?: string;
  bookingUrl?: string;
  priceLevel?: string;
  priceRange?: string;
}

export type Interest =
  | "Technology"
  | "Science"
  | "Movies"
  | "Music"
  | "Sports"
  | "Finance"
  | "Travel"
  | "Gaming"
  | "Social"
  | "Business"
  | "Design"
  | "Lifestyle";

export type Vibe =
  | "unwind"
  | "feel-good"
  | "curious"
  | "focused"
  | "adventure"
  | "surprise";

export type CompanyPref = "alone" | "friends" | "family";
export type BudgetPref = "free" | "budget" | "flexible";
export type SettingPref = "home" | "out";

export interface PreferencesState {
  displayName: string;
  interests: Interest[];
  followedTopics: Interest[];
  topicBoosts: Record<string, number>;
  openCounts: Record<string, number>;
  dismissedIds: string[];
  onboardingComplete: boolean;
  onboardingCompleted?: boolean;
  atmosphereOverride?: string | null;
}

export interface FavoriteRecord {
  id: string;
  savedAt: string;
  item: ContentItem;
}

export type ThemeMode = "light" | "dark";

export type FeedModuleId =
  | "featured"
  | "topics"
  | "news"
  | "movies"
  | "music"
  | "social"
  | "myspace"
  | "together";

export interface TogetherMember {
  id: string;
  name: string;
  initials: string;
  isYou?: boolean;
}

export interface SharedGroupItem {
  id: string;
  addedBy: string;
  addedAt: string;
  votes: Record<string, 1 | -1>;
  item: ContentItem;
}

export type RoomStatus = "planning" | "voting" | "scheduled";

export interface PlanningRoom {
  title: string;
  status: RoomStatus;
  notes: string;
  scheduledFor: string | null;
}

export interface DiscoveryGroup {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  createdAt: string;
  members: TogetherMember[];
  items: SharedGroupItem[];
  room: PlanningRoom;
}

export interface ActivityEvent {
  id: string;
  text: string;
  createdAt: string;
}

export interface ContentResponse {
  items: ContentItem[];
  provenance: DataProvenance;
  message?: string;
}

export interface SearchResponse {
  news: ContentItem[];
  movies: ContentItem[];
  social: ContentItem[];
  newsProvenance: DataProvenance;
  moviesProvenance: DataProvenance;
}
