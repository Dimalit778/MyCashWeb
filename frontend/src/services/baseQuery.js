import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { isPlatformMobile } from "utils/paltformUtils";
import { tokenStorage } from "utils/tokenStorage";

// const BASE_URL = "https://mycashserver.onrender.com";
const BASE_URL = "http://localhost:5000";
const isMobile = isPlatformMobile();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: isMobile ? "omit" : "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    // For mobile, add tokens to headers
    if (isMobile) {
      const tokens = tokenStorage.getTokens();
      if (tokens?.accessToken) {
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      }
      if (tokens?.refreshToken) {
        headers.set("Refresh", tokens.refreshToken);
      }
    }

    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle token refresh for mobile
  if (isMobile && result.meta?.response?.headers) {
    const newToken = result.meta.response.headers.get("mobileToken");
    if (newToken) {
      tokenStorage.setTokens(newToken, tokenStorage.getTokens()?.refreshToken);
    }
  }

  return result;
};
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Transaction", "User", "Auth", "Categories"],
  endpoints: () => ({}),
});
