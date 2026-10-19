"use client";

import { Onboarding } from "@/components/onboarding/Onboarding";
import { ToastContainer } from "@/components/ui/Toast";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { AtmosphericBackground } from "./AtmosphericBackground";
import { FloatingDock } from "./FloatingDock";
import { PlutoSidebar } from "./PlutoSidebar";
import { PlutoTopBar } from "./PlutoTopBar";
import { SearchModal } from "./SearchModal";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/signup/");

  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K or '/' when not typing in an input
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dedicated standalone layout for authentication routes (login / signup)
  if (isAuthRoute) {
    return (
      <div className="min-h-screen w-full bg-[#F5EFEB] dark:bg-[#07080c] text-neutral-900 dark:text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 transition-colors duration-300">
        <main className="w-full min-h-screen">{children}</main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg text-fg flex flex-col selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 transition-colors duration-300">
      {/* 1. Atmospheric Luminous Ribbon Background matching the reference */}
      <AtmosphericBackground />

      {/* 2. Main Shell Layout with Floating Glass Sidebar & Content Container */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-5 flex-1 flex gap-5 xl:gap-7 items-start">
        {/* Left Floating Navigation Sidebar (Desktop) */}
        <Suspense fallback={null}>
          <PlutoSidebar />
        </Suspense>

        {/* Center Main Stage + Header */}
        <div className="flex-1 min-w-0 flex flex-col w-full">
          {/* Top Bar with Search Capsule & Profile */}
          <PlutoTopBar onOpenSearch={() => setSearchOpen(true)} />

          {/* Primary View Content */}
          <main className="flex-1 pb-24 lg:pb-12 w-full">{children}</main>
        </div>
      </div>

      {/* Mobile Floating Navigation Dock (Hidden on desktop where sidebar is active) */}
      <div className="lg:hidden">
        <FloatingDock onOpenSearch={() => setSearchOpen(true)} />
      </div>

      {/* Overlays */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <Onboarding />
      <ToastContainer />
    </div>
  );
}
