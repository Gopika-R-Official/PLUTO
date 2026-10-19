import { AuthExperience } from "@/features/auth/AuthExperience";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Account — Pluto",
  description: "Join Pluto and personalize your discovery experience across films, music, places, and ideas.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#07080C] animate-pulse" />}>
      <AuthExperience initialMode="signup" />
    </Suspense>
  );
}
