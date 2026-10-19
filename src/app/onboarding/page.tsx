import { Onboarding } from "@/components/onboarding/Onboarding";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Pluto · Personal Setup",
  description: "Personalize your Pluto content discovery radar, topics, and identity.",
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-bg text-fg px-4 py-12">
      <Onboarding forceVisible={true} />
    </main>
  );
}
