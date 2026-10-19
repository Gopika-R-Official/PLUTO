import { MoviesView } from "@/features/movies/MoviesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies & Cinema Radar | Pluto",
  description:
    "Explore global box office leaderboards, festival debuts, official 4K cinema trailers, and verified ticket showtimes.",
};

export default function MoviesPage() {
  return <MoviesView />;
}
