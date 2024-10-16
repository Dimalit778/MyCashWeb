import { apiSlice } from "../../config/apiSlice";

const URL = "/api/transactions";

export const transactionsApiSlice = apiSlice.injectEndpoints({
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    // Get single transaction (expense or income)
    getTransaction: builder.query({
      query: ({ type, id }) => `${URL}/get${type}/${id}`,
      credentials: "include",
      providesTags: ["Transaction"],
    }),

    // Get all transactions (expenses or incomes)
    getMonthlyTransactions: builder.query({
      query: ({ type, date }) => ({
        url: `${URL}/monthly`,
        method: "GET",
        params: { date, type },
        credentials: "include",
      }),
      providesTags: ["Transaction"],
    }),
    // Get Yearly transactions
    getYearlyTransactions: builder.query({
      query: ({ year }) => ({
        url: `${URL}/yearly`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Transaction"],
    }),

    // Add transaction (expense or income)
    addTransaction: builder.mutation({
      query: ({ data }) => ({
        url: `${URL}/add`,
        method: "POST",
        credentials: "include",
        body: data, // Include type in the body instead of params
      }),
      invalidatesTags: ["Transaction"],
    }),

    // Update transaction (expense or income)
    updateTransaction: builder.mutation({
      query: ({ type, _id, ...rest }) => ({
        url: `${URL}/update${type}/${_id}`,
        method: "PATCH",
        credentials: "include",
        body: rest,
      }),
      invalidatesTags: ["Transaction"],
    }),

    // Delete transaction (expense or income)
    deleteTransaction: builder.mutation({
      query: ({ type, id }) => ({
        url: `${URL}/delete${type}/${id}`,
        method: "DELETE",
        params: { type, id },
        credentials: "include",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionQuery,
  useGetYearlyTransactionsQuery,
  useGetMonthlyTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApiSlice;
