"use client";

import { STORAGE_KEYS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/persist";
import { resolveAtmosphere, type ThemeAtmosphere } from "@/lib/theme";
import type { FeedModuleId, FavoriteRecord, PreferencesState, ThemeMode } from "@/lib/types";
import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type RootState } from "./index";
import { setAuthUser, setAuthStatus } from "./slices/authSlice";
import { hydrateFavorites } from "./slices/favoritesSlice";
import { hydrateLayout } from "./slices/layoutSlice";
import { hydrateMyspace } from "./slices/myspaceSlice";
import { hydratePreferences, setDisplayName } from "./slices/preferencesSlice";
import { hydrateTheme } from "./slices/themeSlice";
import { hydrateTogether } from "./slices/togetherSlice";

function applyAtmosphere(atmosphere: ThemeAtmosphere) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--theme-accent", atmosphere.accent);
  root.style.setProperty("--theme-accent-hover", atmosphere.accentHover);
  root.style.setProperty("--theme-accent-secondary", atmosphere.accentSecondary);
  root.style.setProperty("--theme-accent-muted", atmosphere.accentMuted);
  root.style.setProperty("--theme-accent-glow", atmosphere.accentGlow);
  root.style.setProperty("--theme-gradient", atmosphere.gradient);
  root.style.setProperty("--theme-surface-glow", atmosphere.surfaceGlow);
  root.style.setProperty("--theme-badge-bg", atmosphere.badgeBg);
  root.style.setProperty("--theme-badge-fg", atmosphere.badgeFg);
  root.setAttribute("data-atmosphere", atmosphere.id);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => makeStore());

  useEffect(() => {
    const theme = readJson<ThemeMode | null>(STORAGE_KEYS.theme, null);
    if (theme === "light" || theme === "dark") {
      store.dispatch(hydrateTheme(theme));
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      store.dispatch(hydrateTheme("dark"));
    }

    const hydratedPrefs = readJson<PreferencesState>(STORAGE_KEYS.preferences, store.getState().preferences);
    store.dispatch(hydratePreferences(hydratedPrefs));
    store.dispatch(hydrateFavorites(readJson<FavoriteRecord[]>(STORAGE_KEYS.favorites, [])));
    store.dispatch(hydrateLayout(readJson<FeedModuleId[]>(STORAGE_KEYS.layout, store.getState().layout.feedOrder)));
    store.dispatch(hydrateMyspace(readJson(STORAGE_KEYS.myspace, store.getState().myspace)));
    store.dispatch(hydrateTogether(readJson(STORAGE_KEYS.together, store.getState().together)));

    const initialAtmosphere = resolveAtmosphere(
      hydratedPrefs.interests ?? [],
      hydratedPrefs.atmosphereOverride,
    );
    applyAtmosphere(initialAtmosphere);

    // Sync server-side authentication session
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : { authenticated: false, user: null }))
      .then((data) => {
        if (data.authenticated && data.user) {
          store.dispatch(setAuthUser(data.user));
          if (data.user.name && data.user.name !== store.getState().preferences.displayName) {
            store.dispatch(setDisplayName(data.user.name));
          }
        } else {
          store.dispatch(setAuthStatus("unauthenticated"));
        }
      })
      .catch(() => {
        store.dispatch(setAuthStatus("unauthenticated"));
      });

    const unsubscribe = store.subscribe(() => {
      const state: RootState = store.getState();
      writeJson(STORAGE_KEYS.theme, state.theme.mode);
      writeJson(STORAGE_KEYS.preferences, state.preferences);
      writeJson(STORAGE_KEYS.favorites, state.favorites.items);
      writeJson(STORAGE_KEYS.layout, state.layout.feedOrder);
      writeJson(STORAGE_KEYS.myspace, state.myspace);
      writeJson(STORAGE_KEYS.together, state.together);
      document.documentElement.classList.toggle("dark", state.theme.mode === "dark");

      const currentAtmosphere = resolveAtmosphere(
        state.preferences.interests,
        state.preferences.atmosphereOverride,
      );
      applyAtmosphere(currentAtmosphere);
    });

    const current = store.getState().theme.mode;
    document.documentElement.classList.toggle("dark", current === "dark");

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
