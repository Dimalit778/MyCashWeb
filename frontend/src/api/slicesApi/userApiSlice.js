import { apiSlice } from "./apiSlice";

const USER_URL = "/api/users";
const AUTH_URL = "/api/auth";

export const userApiSlice = apiSlice.injectEndpoints({
  // ---------->   { AUTH URL ROUTES  }
  endpoints: (builder) => ({
    //@ ---> Google Auth User
    googleAuth: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/googleAuth`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["User"],
    }),
    //?  GET  USER DATA
    getUser: builder.query({
      query: () => ({
        url: `${USER_URL}/getUser`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    //? ---> Login User
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    //? ---> signup User
    signUp: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    //? ---> Logout User
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
    //? --->   Verify Email
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/verify-email/${data}`,
        method: "POST",
        credentials: "include",
      }),
    }),
    //? --->   Forgot password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    //? --->   Verify reset Link
    verifyLink: builder.mutation({
      query: ({ id, token }) => ({
        url: `${AUTH_URL}/reset-password/${id}/${token}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    //? --->   Reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/reset-password/${data.id}/${data.token}`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    // ---------->   { USER URL ROUTES  }

    //? ---> Update User
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

    //@ ---> Upload Image
    uploadImage: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/uploadImage`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
    }),
    //@ ---> Delete Image From Cloudinary
    deleteImage: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deleteImage`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
    }),
    //?~~~~~~~~~~ -- ADMIN ->
    // --->  GET ALL USERS
    allUsers: builder.query({
      query: () => ({
        url: `${USER_URL}/getAll`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    //-----> Admin -  DELETE USER
    AdminDeleteUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deleteUser`,
        credentials: "include",
        method: "POST",
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
} = userApiSlice;
