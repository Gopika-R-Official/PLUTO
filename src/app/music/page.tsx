import { MusicView } from "@/features/music/MusicView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music & Vinyl Vault | Pluto",
  description:
    "Explore analog synthesizers, orchestral suites, acoustic sessions, and curated vinyl presses with live audio playback.",
};

export default function MusicPage() {
  return <MusicView />;
}
