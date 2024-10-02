import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./api/slicesApi/authSlice";

import { apiSlice } from "./api/slicesApi/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([apiSlice.middleware]),
  devTools: false,
});

export default store;
