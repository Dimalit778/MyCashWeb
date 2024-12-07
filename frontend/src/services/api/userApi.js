import { USER_URL } from "config/api";
import toast from "react-hot-toast";
import { apiSlice } from "services/baseQuery";
import { setUser } from "services/reducers/userSlice";

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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {
          dispatch(setUser(arg));
          toast.error("Failed to update user");
        }
      },
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: `${USER_URL}/delete`,
        method: "DELETE",
        credentials: "include",
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
      invalidatesTags: ["User"],
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
  }),
});

export const {
  useUpdateUserMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
  useDeleteUserMutation,
  useGetUserQuery,
} = userApiSlice;
