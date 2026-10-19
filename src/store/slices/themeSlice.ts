import type { ThemeMode } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = { mode: "light" };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    hydrateTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { hydrateTheme, setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
