import toast from "react-hot-toast";
import { apiSlice } from "services/api/baseQuery";
import { setCategories, setUser } from "services/reducers/userSlice";

const USER_URL = "/api/users";

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
        url: `${USER_URL}/updateUser`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["UserData"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(setUser(arg));
          toast.error("Failed to update user");
        }
      },
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: `${USER_URL}/deleteUser`,
        credentials: "include",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    uploadImage: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/uploadImage`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["UserData"],
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const previousImage = getState().root.user.profileImage;
        try {
          const { data: imageUrl } = await queryFulfilled;
          dispatch(setUser({ ...getState().root.user, profileImage: imageUrl }));
        } catch (error) {
          dispatch(setUser({ ...getState().root.user, profileImage: previousImage }));
          toast.error("Failed to upload image");
        }
      },
    }),
    deleteImage: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deleteImage`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    // ---- Categories
    getCategories: builder.query({
      query: () => ({
        url: `${USER_URL}/getCategories`,
        credentials: "include",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/addCategory`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
      async onQueryStarted({ type, category }, { dispatch, getState }) {
        try {
          const currentCategories = getState().root.user.categories;
          // Optimistically update UI
          dispatch(
            setCategories({
              ...currentCategories,
              [type]: [...currentCategories[type], category],
            })
          );
        } catch (error) {
          // Revert optimistic update
          dispatch(setCategories(getState().root.user.categories));
          toast.error("Failed to update categories");
        }
      },
    }),

    deleteCategory: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deleteCategory`,
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
      async onQueryStarted({ type, categoryId }, { dispatch, getState }) {
        const previousCategories = getState().root.user.categories;
        try {
          dispatch(
            setCategories({
              ...previousCategories,
              [type]: previousCategories[type].filter((cat) => cat !== categoryId),
            })
          );
        } catch (error) {
          // Revert to previous state on failure
          dispatch(setCategories(previousCategories));
          toast.error("Failed to delete category");
        }
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
  useAllUsersQuery,
  useDeleteUserMutation,
  useGetUserQuery,
  useAdminDeleteUserMutation,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} = userApiSlice;
