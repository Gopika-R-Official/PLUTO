import type { BudgetPref, CompanyPref, SettingPref, Vibe } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MyspaceState {
  vibe: Vibe | null;
  company: CompanyPref | null;
  budget: BudgetPref | null;
  setting: SettingPref | null;
  city: string;
}

const initialState: MyspaceState = {
  vibe: null,
  company: null,
  budget: null,
  setting: null,
  city: "Bengaluru",
};

const myspaceSlice = createSlice({
  name: "myspace",
  initialState,
  reducers: {
    hydrateMyspace(_state, action: PayloadAction<MyspaceState>) {
      return { ...initialState, ...action.payload };
    },
    setVibe(state, action: PayloadAction<Vibe | null>) {
      state.vibe = action.payload;
    },
    setCompany(state, action: PayloadAction<CompanyPref | null>) {
      state.company = action.payload;
    },
    setBudget(state, action: PayloadAction<BudgetPref | null>) {
      state.budget = action.payload;
    },
    setSetting(state, action: PayloadAction<SettingPref | null>) {
      state.setting = action.payload;
    },
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    clearSession(state) {
      state.vibe = null;
      state.company = null;
      state.budget = null;
      state.setting = null;
    },
  },
});

export const { hydrateMyspace, setVibe, setCompany, setBudget, setSetting, setCity, clearSession } =
  myspaceSlice.actions;
export default myspaceSlice.reducer;
