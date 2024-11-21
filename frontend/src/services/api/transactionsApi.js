import { TRANSACTION_URL } from "config/api";
import { apiSlice } from "services/baseQuery";

export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all transactions (expenses or incomes)
    getMonthlyTransactions: builder.query({
      query: ({ type, date }) => ({
        url: `${TRANSACTION_URL}/monthly`,
        method: "GET",
        params: { date, type },
        credentials: "include",
      }),
      providesTags: ["Transaction"],
    }),
    // Get Yearly transactions
    getYearlyTransactions: builder.query({
      query: ({ year }) => ({
        url: `${TRANSACTION_URL}/yearly`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Transaction"],
    }),

    // Add transaction (expense or income)
    addTransaction: builder.mutation({
      query: (formattedData) => ({
        url: `${TRANSACTION_URL}/add`,
        method: "POST",
        credentials: "include",
        body: formattedData,
      }),
      invalidatesTags: ["Transaction"],
    }),

    // Update transaction (expense or income)
    updateTransaction: builder.mutation({
      query: (data) => ({
        url: `${TRANSACTION_URL}/update`,
        method: "PATCH",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Transaction"],
    }),

    // Delete transaction (expense or income)
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
  useGetTransactionQuery,
  useGetYearlyTransactionsQuery,
  useGetMonthlyTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApiSlice;

// import { apiSlice } from "./baseQuery";

// const URL = "/api/transactions";

// export const transactionApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getYearlyTransactions: builder.query({
//       query: (year) => ({
//         url: `${URL}/yearly`,
//         method: "GET",
//         params: { year },
//         credentials: "include",
//       }),
//       // Transform response to match your backend structure
//       transformResponse: (response) => ({
//         monthlyData: response.monthlyData.map((month) => ({
//           ...month,
//           // Ensure dates are properly formatted
//           expenseTransactions:
//             month.expenseTransactions?.map((tx) => ({
//               ...tx,
//               date: new Date(tx.date),
//             })) || [],
//           incomeTransactions:
//             month.incomeTransactions?.map((tx) => ({
//               ...tx,
//               date: new Date(tx.date),
//             })) || [],
//         })),
//         yearSummary: response.yearSummary,
//       }),
//       providesTags: (result, error, year) => [{ type: "Transaction", id: `yearly-${year}` }],
//     }),

//     getMonthlyTransactions: builder.query({
//       query: ({ type, date }) => ({
//         url: `${URL}/monthly`,
//         method: "GET",
//         params: { date, type },
//         credentials: "include",
//       }),
//       transformResponse: (response, meta, arg) => ({
//         allData: response.transactions || [],
//         totalAmount: response.totalAmount || 0,
//         sortByCategory: response.categoryData || [],
//       }),
//       providesTags: (result, error, { type, date }) => [{ type: "Transaction", id: `${type}-${date}` }],
//     }),

//     addTransaction: builder.mutation({
//       query: ({ type, ...formData }) => ({
//         url: `${URL}/add`,
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       }),
//       // Invalidate both yearly and monthly queries
//       invalidatesTags: (result, error, { date }) => [
//         { type: "Transaction", id: `yearly-${new Date(date).getFullYear()}` },
//         { type: "Transaction", id: `${result.type}-${date}` },
//       ],
//     }),

//     updateTransaction: builder.mutation({
//       query: ({ id, type, ...data }) => ({
//         url: `${URL}/update`,
//         method: "PATCH",
//         credentials: "include",
//         body: { id, type, ...data },
//       }),
//       invalidatesTags: (result, error, { type, date }) => [
//         { type: "Transaction", id: `yearly-${new Date(date).getFullYear()}` },
//         { type: "Transaction", id: `${type}-${date}` },
//       ],
//     }),

//     deleteTransaction: builder.mutation({
//       query: ({ id, type }) => ({
//         url: `${URL}/delete/${id}/${type}`,
//         method: "DELETE",
//         credentials: "include",
//       }),
//       invalidatesTags: (result, error, { type, date }) => [
//         { type: "Transaction", id: `yearly-${new Date(date).getFullYear()}` },
//         { type: "Transaction", id: `${type}-${date}` },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetYearlyTransactionsQuery,
//   useGetMonthlyTransactionsQuery,
//   useAddTransactionMutation,
//   useUpdateTransactionMutation,
//   useDeleteTransactionMutation,
// } = transactionApi;
