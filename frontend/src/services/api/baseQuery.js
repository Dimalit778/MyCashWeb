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

// const customBaseQuery = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (
//     result?.error?.status === 401 ||
//     result?.error?.data?.message === "You are not logged in" ||
//     result?.error?.data?.error === "Unauthorized: No Token Provided" ||
//     result?.error?.data?.error === "Unauthorized: Invalid Token"
//   ) {
//     // Try to refresh token
//     const refreshResult = await baseQuery(
//       {
//         url: "auth/refresh",
//         method: "POST",
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult.data) {
//       // Retry the original request
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       // Redirect to login if refresh fails
//       if (typeof window !== "undefined") {
//         const currentPath = window.location.pathname;
//         if (currentPath !== "/login") {
//           window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
//         } else {
//           window.location.href = "/login";
//         }
//       }
//     }
//   }

//   return result;
// };
// const handleAuthFailure = (api) => {
//   if (typeof window !== "undefined") {
//     const currentPath = window.location.pathname;
//     if (currentPath !== "/login") {
//       const returnUrl = encodeURIComponent(currentPath);
//       window.location.href = `/login?returnUrl=${returnUrl}`;
//     } else {
//       window.location.href = "/login";
//     }
//   }
// };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Transaction", "User", "Auth"],
  endpoints: () => ({}),
});
