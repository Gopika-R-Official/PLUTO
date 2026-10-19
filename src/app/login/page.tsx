import { AuthExperience } from "@/features/auth/AuthExperience";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Log In — Pluto",
  description: "Sign in to access your personalized discovery experience, saved items, and curated culture.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#07080C] animate-pulse" />}>
      <AuthExperience initialMode="login" />
    </Suspense>
  );
}
