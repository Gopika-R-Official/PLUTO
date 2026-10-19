import type { ContentItem } from "../types";

export const MOCK_RESTAURANTS: ContentItem[] = [
  {
    id: "restaurant-ivy-mumbai",
    type: "restaurant",
    title: "The Ivy Mumbai",
    description:
      "All-day British and European brasserie classics served in an opulent art-deco dining room with bespoke botanical murals.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    categories: ["Travel", "Lifestyle"],
    source: "Michelin Guide & Zomato",
    url: "https://theivycollection.com",
    publishedAt: "2026-10-18T10:00:00.000Z",
    provenance: "mock",
    metadata: {
      rating: 4.5,
      cuisine: "European Contemporary",
      locationLabel: "BKC, Mumbai",
      priceLevel: "$$$",
      cost: "flexible",
      reservationUrl:
        "https://www.google.com/search?q=The+Ivy+Mumbai+restaurant+table+reservation",
    },
  },
  {
    id: "restaurant-nobu-mumbai",
    type: "restaurant",
    title: "Nobu Mumbai",
    description:
      "Chef Nobu Matsuhisa's legendary Peruvian-influenced Japanese gastronomy featuring black cod miso, yellowtail jalapeño, and pristine sashimi.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    categories: ["Travel", "Lifestyle"],
    source: "Nobu Worldwide",
    url: "https://www.noburestaurants.com",
    publishedAt: "2026-10-17T12:00:00.000Z",
    provenance: "mock",
    metadata: {
      rating: 4.7,
      cuisine: "Japanese Peruvian",
      locationLabel: "Worli, Mumbai",
      priceLevel: "$$$$",
      cost: "flexible",
      reservationUrl:
        "https://www.google.com/search?q=Nobu+Mumbai+reserve+table",
    },
  },
  {
    id: "restaurant-sukiyabashi-tokyo",
    type: "restaurant",
    title: "Sukiyabashi Jiro",
    description:
      "World-renowned edomae sushi sanctuary in Ginza crafting twenty strictly paced courses of seasonal ocean catches.",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    categories: ["Travel", "Lifestyle"],
    source: "Tokyo Table Review",
    url: "https://www.sushi-jiro.jp",
    publishedAt: "2026-10-16T14:00:00.000Z",
    provenance: "mock",
    metadata: {
      rating: 4.8,
      cuisine: "Japanese Omakase",
      locationLabel: "Ginza, Tokyo",
      priceLevel: "$$$$",
      cost: "flexible",
      reservationUrl:
        "https://www.google.com/search?q=Sukiyabashi+Jiro+Tokyo+reservation",
    },
  },
  {
    id: "restaurant-le-bernardin-nyc",
    type: "restaurant",
    title: "Le Bernardin",
    description:
      "Chef Eric Ripert's three-Michelin-star seafood institution with sublime French technique and refined hospitality.",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    categories: ["Travel", "Lifestyle"],
    source: "Michelin Guide NYC",
    url: "https://www.le-bernardin.com",
    publishedAt: "2026-10-15T18:00:00.000Z",
    provenance: "mock",
    metadata: {
      rating: 4.9,
      cuisine: "French Seafood",
      locationLabel: "Midtown, New York",
      priceLevel: "$$$$",
      cost: "flexible",
      reservationUrl: "https://www.le-bernardin.com/reservations",
    },
  },
  {
    id: "restaurant-bastian-mumbai",
    type: "restaurant",
    title: "Bastian At The Top",
    description:
      "Panoramic skyline dining high above Mumbai serving lobster ceviche, spicy crab platters, and modern Asian craft cocktails.",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    categories: ["Travel", "Lifestyle"],
    source: "Bastian Hospitality",
    url: "https://bastianhospitality.com",
    publishedAt: "2026-10-14T20:00:00.000Z",
    provenance: "mock",
    metadata: {
      rating: 4.6,
      cuisine: "Modern Asian & Seafood",
      locationLabel: "Bandra, Mumbai",
      priceLevel: "$$$",
      cost: "flexible",
      reservationUrl:
        "https://www.google.com/search?q=Bastian+Mumbai+reserve+table",
    },
  },
];
