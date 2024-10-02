import { apiSlice } from './apiSlice';

const URL = '/api/transactions';

export const expenseApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['Expense'],
  endpoints: (builder) => ({
    //? -- GET Expense
    getExpense: builder.query({
      query: (expenseId) => `${URL}/getExpense/${expenseId}`,
      credentials: 'include',
      providesTags: ['Expense'],
    }),
    //? -- GET ALL EXPENSES
    getAllExpenses: builder.query({
      query: () => ({
        url: `${URL}/getAllExpenses`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Expense'],
    }),
    //? -- ADD  EXPENSE
    addExpense: builder.mutation({
      query: (data) => ({
        url: `${URL}/addExpense`,
        method: 'POST',
        credentials: 'include',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),
    //? -- UPDATE EXPENSE
    updateExpense: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `${URL}/updateExpense/${_id}`,
        method: 'PATCH',
        credentials: 'include',
        body: rest,
      }),
      invalidatesTags: ['Expense'],
    }),
    //? -- DELETE EXPENSE
    deleteExpense: builder.mutation({
      query: (expenseId) => ({
        url: `${URL}/deleteExpense/${expenseId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Expense'],
    }),
  }),
});
export const {
  useGetAllExpensesQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useUpdateExpenseMutation,
} = expenseApiSlice;
