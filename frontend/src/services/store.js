import { combineReducers, configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import userReducer from "./reducers/userSlice.js";
import themeReducer from "./reducers/themeSlice.js";
import uiReducer from "./reducers/uiSlice.js";
import { setupListeners } from "@reduxjs/toolkit/dist/query/index.js";
import { apiSlice } from "./baseQuery.js";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["user", "theme"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: {
    root: persistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);
