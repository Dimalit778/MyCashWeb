import { TRANSACTION_URL } from "config/api";
import { apiSlice } from "services/baseQuery";

export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getYearlyTransactions: builder.query({
      query: ({ year }) => ({
        url: `${TRANSACTION_URL}/yearly`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Transaction"],
    }),
    getMonthlyTransactions: builder.query({
      query: ({ type, year, month, page = 1, limit = 10, sortBy, sortOrder }) => ({
        url: `${TRANSACTION_URL}/monthlyData?type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Transaction"],
    }),
    addTransaction: builder.mutation({
      query: (formattedData) => ({
        url: `${TRANSACTION_URL}/add`,
        method: "POST",
        credentials: "include",
        body: formattedData,
      }),
      invalidatesTags: ["Transaction"],
    }),
    updateTransaction: builder.mutation({
      query: (data) => ({
        url: `${TRANSACTION_URL}/update`,
        method: "PATCH",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Transaction"],
    }),
    deleteTransaction: builder.mutation({
      query: ({ id }) => ({
        url: `${TRANSACTION_URL}/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetMonthlyTransactionsQuery,
  useGetYearlyTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApiSlice;
