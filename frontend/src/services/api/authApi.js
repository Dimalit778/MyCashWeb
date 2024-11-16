import { apiSlice } from "./baseQuery";
import { clearUser } from "services/reducers/userSlice";

const AUTH_URL = "/api/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(clearUser());
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    googleAuth: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/googleAuth`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["Auth"],
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["Auth"],
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
  }),
});
export const {
  useLoginMutation,
  useLogoutMutation,
  useGoogleAuthMutation,
  useSignUpMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useVerifyLinkMutation,
  useResetPasswordMutation,
} = authApiSlice;
