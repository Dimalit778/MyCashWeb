// src/services/store/baseQuery.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://mycashserver.onrender.com";
const BASE_URL = "http://localhost:5000";

// Create the base query
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Transaction", "User", "Auth", "Categories"],
  endpoints: () => ({}),
});
