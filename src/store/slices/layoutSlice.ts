import { DEFAULT_FEED_ORDER } from "@/lib/constants";
import type { FeedModuleId } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  feedOrder: FeedModuleId[];
}

const initialState: LayoutState = { feedOrder: DEFAULT_FEED_ORDER };

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    hydrateLayout(state, action: PayloadAction<FeedModuleId[]>) {
      const incoming = action.payload.filter((id) => DEFAULT_FEED_ORDER.includes(id));
      const missing = DEFAULT_FEED_ORDER.filter((id) => !incoming.includes(id));
      state.feedOrder = [...incoming, ...missing];
    },
    setFeedOrder(state, action: PayloadAction<FeedModuleId[]>) {
      state.feedOrder = action.payload;
    },
    moveModule(state, action: PayloadAction<{ id: FeedModuleId; direction: -1 | 1 }>) {
      const index = state.feedOrder.indexOf(action.payload.id);
      const next = index + action.payload.direction;
      if (index < 0 || next < 0 || next >= state.feedOrder.length) return;
      const copy = [...state.feedOrder];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      state.feedOrder = copy;
    },
    resetLayout(state) {
      state.feedOrder = DEFAULT_FEED_ORDER;
    },
  },
});

export const { hydrateLayout, setFeedOrder, moveModule, resetLayout } = layoutSlice.actions;
export default layoutSlice.reducer;
