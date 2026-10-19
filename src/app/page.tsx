"use client";

import { HomeView } from "@/features/home/HomeView";
import { useAppSelector } from "@/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function HomeEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isGuestParam = searchParams.get("guest") === "true";
    const isGuestSession =
      typeof window !== "undefined" &&
      sessionStorage.getItem("pluto_guest") === "true";

    if (!isAuthenticated && !isGuestParam && !isGuestSession) {
      router.replace("/login");
    } else {
      if (isGuestParam && typeof window !== "undefined") {
        sessionStorage.setItem("pluto_guest", "true");
      }
      setReady(true);
    }
  }, [isAuthenticated, router, searchParams]);

  if (!ready) {
    return (
      <div className="min-h-screen w-full bg-[#07080C] flex items-center justify-center">
        <div className="h-7 w-7 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <HomeView />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#07080C] flex items-center justify-center">
          <div className="h-7 w-7 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <HomeEntry />
    </Suspense>
  );
}
