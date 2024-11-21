import { CATEGORY_URL } from "config/api";
import { apiSlice } from "services/baseQuery";

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (type) => ({
        url: `${CATEGORY_URL}/get`,
        credentials: "include",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `${CATEGORY_URL}/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } = categoriesApiSlice;
