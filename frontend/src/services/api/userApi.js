import { USER_URL } from "config/api";

import { apiSlice } from "services/baseQuery";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: `${USER_URL}/getUser`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/update`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: `${USER_URL}/delete`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    imageActions: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/imageActions`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUpdateUserMutation, useImageActionsMutation, useDeleteUserMutation, useGetUserQuery } = userApiSlice;
