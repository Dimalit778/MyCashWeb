import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { getNavigate } from "utils/navigate";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://mycashserver.onrender.com",
  baseUrl: "http://localhost:5000",
});
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const navigate = getNavigate();
    navigate("/", {
      state: {
        redirectUrl: window.location.pathname,
      },
    });
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithErrorHandling,

  tagTypes: ["User", "Transaction"],

  endpoints: (builder) => ({}),
});
