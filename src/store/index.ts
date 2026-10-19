import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { contentApi } from "./api/contentApi";
import authReducer from "./slices/authSlice";
import favoritesReducer from "./slices/favoritesSlice";
import layoutReducer from "./slices/layoutSlice";
import myspaceReducer from "./slices/myspaceSlice";
import preferencesReducer from "./slices/preferencesSlice";
import themeReducer from "./slices/themeSlice";
import togetherReducer from "./slices/togetherSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  preferences: preferencesReducer,
  favorites: favoritesReducer,
  theme: themeReducer,
  layout: layoutReducer,
  myspace: myspaceReducer,
  together: togetherReducer,
  [contentApi.reducerPath]: contentApi.reducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(contentApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
