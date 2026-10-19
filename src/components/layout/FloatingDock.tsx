"use client";

import {
  Compass,
  Home,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface FloatingDockProps {
  onOpenSearch: () => void;
}

export function FloatingDock({ onOpenSearch }: FloatingDockProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-md transition-all duration-300"
    >
      <div className="flex items-center justify-around px-3 py-2 rounded-full backdrop-blur-2xl bg-white/90 dark:bg-[#0c101c]/90 border border-slate-200/90 dark:border-white/12 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.85)]">
        {/* 1. Home */}
        <Link
          href="/"
          aria-label="Home"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-2xl transition ${
            pathname === "/"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
        </Link>

        {/* 2. Discover */}
        <Link
          href="/discover"
          aria-label="Discover"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-2xl transition ${
            pathname === "/discover"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Discover</span>
        </Link>

        {/* 3. Center Action Plus Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Quick Search and Actions"
          className="flex items-center justify-center w-12 h-12 -mt-4 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. Music */}
        <Link
          href="/music"
          aria-label="Music"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-2xl transition ${
            pathname === "/music"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span className="relative flex items-center justify-center">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M12 2a10 10 0 0 0 0 20" />
            </svg>
          </span>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Music</span>
        </Link>

        {/* 5. My Space */}
        <Link
          href="/my-space"
          aria-label="My Space"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-2xl transition ${
            pathname === "/my-space"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">My Space</span>
        </Link>
      </div>
    </nav>
  );
}
