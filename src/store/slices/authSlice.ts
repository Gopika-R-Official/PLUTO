import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.status = action.payload ? "authenticated" : "unauthenticated";
      state.error = null;
    },
    updateAuthUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAuthStatus(state, action: PayloadAction<AuthState["status"]>) {
      state.status = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.status = "unauthenticated";
    },
    logoutAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "unauthenticated";
      state.error = null;
    },
  },
});

export const { setAuthUser, updateAuthUser, setAuthStatus, setAuthError, logoutAuth } =
  authSlice.actions;

export default authSlice.reducer;
