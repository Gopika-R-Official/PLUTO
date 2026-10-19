import type { ContentItem } from "../types";

export const MOCK_MUSIC: ContentItem[] = [
  {
    id: "music-1",
    type: "music",
    title: "Promises (Live at Abbey Road)",
    description:
      "A transcendent dialogue between London Symphony Orchestra, Pharoah Sanders' saxophone, and Floating Points' analog synthesizers.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Lifestyle"],
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
  },
  {
    id: "music-2",
    type: "music",
    title: "Vulture Prince (Acoustic Sessions)",
    description:
      "Arooj Aftab’s acoustic Urdu ghazals blended with harp, acoustic bass, and minimal jazz textures. Hypnotic and deeply moving.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Design"],
    source: "Pitchfork Select",
    url: "https://open.spotify.com/search/Arooj%20Aftab%20Mohabbat",
    publishedAt: "2026-10-12T14:30:00.000Z",
    provenance: "mock",
    metadata: {
      artist: "Arooj Aftab",
      album: "Vulture Prince",
      duration: "7:41",
      playlistHint: "Reflective Evening",
      audioPreview: "/audio/track-2.wav",
    },
  },
  {
    id: "music-3",
    type: "music",
    title: "Drukqs Reimagined for Prepared Piano",
    description:
      "Intricate mechanical percussion and microtonal piano studies inspired by Richard D. James' electronic masterwork.",
    image:
      "https://images.unsplash.com/photo-1520523839898-50712825e3a7?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Technology"],
    source: "Warp Curated",
    url: "https://open.spotify.com/search/Aphex%20Twin%20Avril%2014th",
    publishedAt: "2026-10-10T09:15:00.000Z",
    provenance: "mock",
    metadata: {
      artist: "Apex Ensemble",
      album: "Analog Experiments",
      duration: "5:22",
      playlistHint: "Deep Work",
      audioPreview: null,
    },
  },
  {
    id: "music-4",
    type: "music",
    title: "Bengaluru Rain Tape vol. 3",
    description:
      "Field recordings of monsoons over Indiranagar rooftops laced with mellow electric piano chords and vinyl tape flutter.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Lifestyle"],
    source: "Echoes from the South",
    url: "https://open.spotify.com/search/Lo-fi%20Rain%20Coffee",
    publishedAt: "2026-10-08T18:00:00.000Z",
    provenance: "mock",
    metadata: {
      artist: "Coffee & Cables",
      album: "Monsoon Rhythms",
      duration: "32:00",
      playlistHint: "Chill Out",
      audioPreview: "/audio/track-4.wav",
    },
  },
  {
    id: "music-5",
    type: "music",
    title: "Midnight in Tokyo (Haruomi Hosono Tribute)",
    description:
      "Warm analog synthesizers, marimbas, and serene Japanese ambient jazz textures echoing 1980s city pop melancholy.",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Jazz"],
    source: "Tokyo Vinyl Archive",
    url: "https://open.spotify.com/search/Haruomi%20Hosono",
    publishedAt: "2026-10-06T12:00:00.000Z",
    provenance: "mock",
    metadata: {
      artist: "Yasuaki Shimizu & Friends",
      album: "Pacific Ambient",
      duration: "4:32",
      playlistHint: "Late Night Tokyo",
      audioPreview: "/audio/track-1.wav",
    },
  },
  {
    id: "music-6",
    type: "music",
    title: "Music for 18 Musicians (Sections I-IV)",
    description:
      "Pulsing minimalist marimbas, clarinets, and female voices creating a hypnotic, shimmering ocean of acoustic rhythm.",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Classical"],
    source: "ECM Records",
    url: "https://open.spotify.com/search/Steve%20Reich%2018%20Musicians",
    publishedAt: "2026-10-04T16:00:00.000Z",
    provenance: "mock",
    metadata: {
      artist: "Steve Reich Ensemble",
      album: "Music for 18 Musicians",
      duration: "18:24",
      playlistHint: "Mathematical Focus",
      audioPreview: "/audio/track-2.wav",
    },
  },
  {
    id: "music-7",
    type: "music",
    title: "Selected Ambient Works 85-92",
    description:
      "Lush, buoyant ambient techno with subtle acid baselines, ethereal chords, and delicate rhythmic clockwork.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Electronic"],
    source: "Apollo Records",
    url: "https://open.spotify.com/search/Aphex%20Twin%20Ambient%20Works",
    publishedAt: "2026-10-01T20:00:00.000Z",
    provenance: "mock",
    metadata: {
      artist: "Aphex Twin",
      album: "SAW 85-92",
      duration: "6:15",
      playlistHint: "Electronic Heritage",
      audioPreview: "/audio/track-4.wav",
    },
  },
  {
    id: "music-8",
    type: "music",
    title: "Solitude in Kyoto (Garden Sessions)",
    description:
      "Fingerstyle nylon guitar alongside field recordings of temple wind chimes and bamboo water fountain cascades.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
    categories: ["Music", "Acoustic"],
    source: "Kyoto Sound Lab",
    url: "https://open.spotify.com/search/Kyoto%20Garden%20Guitar",
    publishedAt: "2026-09-28T08:00:00.000Z",
    provenance: "mock",
    metadata: {
      artist: "Masayoshi & Ensemble",
      album: "Ryoan-ji Sketches",
      duration: "5:48",
      playlistHint: "Peaceful Solitude",
      audioPreview: "/audio/track-1.wav",
    },
  },
];
