import { apiSlice } from "../../services/store/apiSlice";

const USER_URL = "/api/users";
const AUTH_URL = "/api/auth";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleAuth: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/googleAuth`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: () => ({
        url: `${USER_URL}/getUser`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/verify-email/${data}`,
        method: "POST",
        credentials: "include",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    verifyLink: builder.mutation({
      query: ({ id, token }) => ({
        url: `${AUTH_URL}/reset-password/${id}/${token}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/reset-password/${data.id}/${data.token}`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updateUser`,
        credentials: "include",
        method: "PATCH",
        body: data,
      }),
    }),
    //? ---> Delete User
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
        credentials: "include",
        method: "POST",
        body: data,
      }),
    }),
    deleteImage: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deleteImage`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
    }),
    allUsers: builder.query({
      query: () => ({
        url: `${USER_URL}/getAll`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    AdminDeleteUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deleteUser`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
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
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteCategory: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deleteCategory`,
        credentials: "include",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGoogleAuthMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useSignUpMutation,
  useUpdateUserMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyLinkMutation,
  useAllUsersQuery,
  useDeleteUserMutation,
  useGetUserQuery,
  useAdminDeleteUserMutation,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} = userApiSlice;
