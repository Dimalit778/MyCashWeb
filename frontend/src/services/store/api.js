// src/services/api/customFetchBase.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { logout } from "../store/authSlice";
// baseUrl: "https://mycashserver.onrender.com",
//   baseUrl: "http://localhost:5000",
const baseUrl = "http://localhost:5000";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include", // Include cookies in requests
});

// Custom fetch base query with refresh token logic
const customFetchBase = async (args, api, extraOptions) => {
  // Wait if there's an ongoing token refresh
  await mutex.waitForUnlock();

  // Try the initial query
  let result = await baseQuery(args, api, extraOptions);

  // Check if we got a "not logged in" error
  if (result.error?.data?.message === "You are not logged in") {
    // Check if we're already refreshing the token
    if (!mutex.isLocked()) {
      // Acquire mutex lock
      const release = await mutex.acquire();

      try {
        // Try to refresh the token
        const refreshResult = await baseQuery(
          {
            credentials: "include",
            url: "auth/refresh",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Token refreshed successfully, retry original query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user
          api.dispatch(logout());
          window.location.href = "/login";
        }
      } finally {
        // Always release the mutex lock
        release();
      }
    } else {
      // If another request is already refreshing, wait for it to finish
      await mutex.waitForUnlock();
      // Then retry our request
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default customFetchBase;
