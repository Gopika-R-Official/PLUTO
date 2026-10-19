import { DiscoverExplorationView } from "@/features/discover/DiscoverExplorationView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover — Explore More Content | Pluto",
  description:
    "Explore trending cinema, curated news, music discoveries, and top-rated restaurants across Pluto's cross-category universe.",
};

export default function DiscoverPage() {
  return <DiscoverExplorationView />;
}
