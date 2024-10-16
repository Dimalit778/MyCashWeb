import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./config/authSlice";

import { apiSlice } from "./config/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([apiSlice.middleware]),
  devTools: false,
});

export default store;
