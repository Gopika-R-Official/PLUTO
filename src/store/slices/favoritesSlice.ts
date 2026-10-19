import type { ContentItem, FavoriteRecord } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  items: FavoriteRecord[];
}

const initialState: FavoritesState = { items: [] };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    hydrateFavorites(_state, action: PayloadAction<FavoriteRecord[]>) {
      return { items: action.payload };
    },
    toggleFavorite(state, action: PayloadAction<ContentItem>) {
      const index = state.items.findIndex((record) => record.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift({
          id: action.payload.id,
          savedAt: new Date().toISOString(),
          item: action.payload,
        });
      }
    },
    setFavoritesOrder(state, action: PayloadAction<FavoriteRecord[]>) {
      state.items = action.payload;
    },
  },
});

export const { hydrateFavorites, toggleFavorite, setFavoritesOrder } = favoritesSlice.actions;
export default favoritesSlice.reducer;
