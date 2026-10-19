"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutAuth } from "@/store/slices/authSlice";
import { toggleTheme } from "@/store/slices/themeSlice";
import { toast } from "@/components/ui/Toast";
import {
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, useRef, useEffect } from "react";

interface PlutoTopBarProps {
  onOpenSearch: () => void;
}

export function PlutoTopBar({ onOpenSearch }: PlutoTopBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const displayName = useAppSelector(
    (state) => authUser?.name || state.preferences.displayName || "Alex Rao",
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue client cleanup
    }
    dispatch(logoutAuth());
    toast.info("Signed out of Pluto");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="w-full flex items-center justify-between gap-4 pt-1 pb-4">
      {/* Search Bar Capsule */}
      <div className="flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search movies, news, music, or people"
          className="w-full flex items-center gap-3 px-5 py-2.5 rounded-full text-xs transition-all duration-200 select-none cursor-pointer text-left backdrop-blur-xl bg-[var(--card)]/85 border border-[var(--border)] shadow-xs hover:border-[var(--theme-accent)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]"
        >
          <Search className="h-4 w-4 text-[var(--muted)] shrink-0" />
          <span className="text-[var(--muted)] font-normal truncate">
            Search movies, news, music, or people...
          </span>
          <span className="hidden sm:inline-flex ml-auto px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/10 text-[10px] font-mono text-[var(--muted)]">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Controls: Theme Toggle & Profile Capsule */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--fg)] hover:opacity-80 transition backdrop-blur-xl bg-[var(--card)]/80 border border-[var(--border)] shadow-xs cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-[var(--theme-accent)] transition-transform hover:-rotate-12" />
          )}
        </button>        {/* User Profile Capsule */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label="User Account Menu"
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full backdrop-blur-xl bg-[var(--card)]/85 border border-[var(--border)] shadow-xs hover:border-[var(--theme-accent)]/40 transition group cursor-pointer"
          >
            {authUser?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authUser.avatar}
                alt={displayName}
                className="h-7 w-7 rounded-full object-cover shadow-xs border border-white/20"
              />
            ) : (
              <div className="grid h-7 w-7 place-items-center rounded-full bg-[var(--theme-accent)] text-white text-[11px] font-bold shadow-xs">
                {initials}
              </div>
            )}
            <span className="hidden sm:inline-block text-xs font-semibold text-[var(--fg)] group-hover:text-[var(--theme-accent)] transition truncate max-w-[120px]">
              {displayName}
            </span>
            <ChevronDown className="h-3 w-3 text-[var(--muted)] group-hover:text-[var(--fg)] transition" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-2 z-50 animate-fadeIn text-[var(--fg)] text-xs"
            >
              <div className="px-3 py-2 border-b border-[var(--border)] space-y-0.5">
                <p className="font-semibold text-xs truncate">{displayName}</p>
                <p className="text-[11px] text-[var(--muted)] truncate font-mono">
                  {authUser?.email || "alex@pluto.culture"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/my-space"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                  <span>My Curated Space</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
                >
                  <Settings className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Account & Preferences</span>
                </Link>
              </div>

              {isAuthenticated && (
                <div className="pt-1 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
