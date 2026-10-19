import type {
  BudgetPref,
  CompanyPref,
  ContentItem,
  SettingPref,
  Vibe,
} from "../types";

export interface SpacePick extends ContentItem {
  vibes: Vibe[];
  companies: CompanyPref[];
  budgets: BudgetPref[];
  settings: SettingPref[];
}

export const SPACE_PICKS: SpacePick[] = [
  {
    id: "space-movie-1",
    type: "movie",
    title: "Before Sunrise",
    description: "A walking conversation that still feels like the most generous way to spend an evening.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    categories: ["Movies"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { year: 1995, rating: 8.1 },
    vibes: ["unwind", "feel-good", "curious"],
    companies: ["alone", "friends"],
    budgets: ["free", "budget", "flexible"],
    settings: ["home"],
  },
  {
    id: "space-movie-2",
    type: "movie",
    title: "The Lunchbox",
    description: "Mumbai dabbas, missed delivery, and a letter that arrives at the right wrong desk.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80",
    categories: ["Movies", "Lifestyle"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { year: 2013, rating: 8.2 },
    vibes: ["feel-good", "unwind"],
    companies: ["alone", "family"],
    budgets: ["free", "budget", "flexible"],
    settings: ["home"],
  },
  {
    id: "space-music-1",
    type: "music",
    title: "Late terrace jazz, no talking",
    description: "A 90-minute mix of brushed drums and warm brass. Sample playlist — not a licensed stream.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80",
    categories: ["Music"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { playlistHint: "Search: ‘small combo midnight’" },
    vibes: ["unwind", "focused", "feel-good"],
    companies: ["alone", "friends"],
    budgets: ["free", "budget", "flexible"],
    settings: ["home", "out"],
  },
  {
    id: "space-music-2",
    type: "music",
    title: "Focus raga, 40 minutes",
    description: "A slow alaap that holds a work block without becoming background sludge.",
    image: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&w=1000&q=80",
    categories: ["Music"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { playlistHint: "Search: evening raag for reading" },
    vibes: ["focused", "curious"],
    companies: ["alone"],
    budgets: ["free"],
    settings: ["home"],
  },
  {
    id: "space-article-1",
    type: "news",
    title: "How cities remember water",
    description: "A long essay on tanks, wells, and the maps Bengaluru still carries under its flyovers.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
    categories: ["Science", "Travel"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { author: "Essay desk" },
    vibes: ["curious", "focused"],
    companies: ["alone", "friends"],
    budgets: ["free"],
    settings: ["home"],
  },
  {
    id: "space-place-1",
    type: "place",
    title: "Sample: a quiet library café in Indiranagar",
    description:
      "Sample recommendation — not a verified listing. Look for a corner table, paper menus, and outlets that actually work.",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=80",
    categories: ["Lifestyle"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { locationLabel: "Indiranagar, Bengaluru (sample)", cost: "budget" },
    vibes: ["unwind", "focused", "curious"],
    companies: ["alone", "friends"],
    budgets: ["budget", "flexible"],
    settings: ["out"],
  },
  {
    id: "space-place-2",
    type: "place",
    title: "Sample: Cubbon Park loop at golden hour",
    description:
      "Sample outing — public park. Walk the inner paths, skip the main road photos, leave before it gets performative.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
    categories: ["Lifestyle", "Travel"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { locationLabel: "Cubbon Park, Bengaluru (sample)", cost: "free" },
    vibes: ["adventure", "feel-good", "unwind"],
    companies: ["alone", "friends", "family"],
    budgets: ["free", "budget"],
    settings: ["out"],
  },
  {
    id: "space-activity-1",
    type: "activity",
    title: "Board-game night with a two-game cap",
    description: "Pick one gateway game and one quiet closer. Sample plan — no booking required.",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1000&q=80",
    categories: ["Gaming", "Lifestyle"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { cost: "free" },
    vibes: ["feel-good", "unwind"],
    companies: ["friends", "family"],
    budgets: ["free", "budget"],
    settings: ["home"],
  },
  {
    id: "space-activity-2",
    type: "activity",
    title: "Sample: weekend ceramic walk-in (check locally)",
    description:
      "Sample activity — not a live events feed. Search your city for an open studio; call before you go.",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80",
    categories: ["Design", "Lifestyle"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { locationLabel: "City studio (sample)", cost: "flexible" },
    vibes: ["curious", "adventure", "feel-good"],
    companies: ["alone", "friends"],
    budgets: ["budget", "flexible"],
    settings: ["out"],
  },
  {
    id: "space-activity-3",
    type: "activity",
    title: "Cook one slow thing and a salad",
    description: "A two-hour kitchen evening that still leaves the table looking intentional.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
    categories: ["Lifestyle"],
    source: "My Space sample",
    url: null,
    publishedAt: null,
    provenance: "mock",
    metadata: { cost: "budget" },
    vibes: ["unwind", "feel-good", "focused"],
    companies: ["alone", "friends", "family"],
    budgets: ["budget", "flexible"],
    settings: ["home"],
  },
];

export function pickForSession(filters: {
  vibe: Vibe;
  company: CompanyPref | null;
  budget: BudgetPref | null;
  setting: SettingPref | null;
}): ContentItem[] {
  return SPACE_PICKS.filter((pick) => {
    const vibeOk = filters.vibe === "surprise" || pick.vibes.includes(filters.vibe);
    const companyOk = !filters.company || pick.companies.includes(filters.company);
    const budgetOk = !filters.budget || pick.budgets.includes(filters.budget);
    const settingOk = !filters.setting || pick.settings.includes(filters.setting);
    return vibeOk && companyOk && budgetOk && settingOk;
  }).map((pick) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vibes, companies, budgets, settings, ...item } = pick;
    return item;
  });
}
