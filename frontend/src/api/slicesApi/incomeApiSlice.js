import { apiSlice } from './apiSlice';

const URL = '/api/transactions';

export const incomeApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['Income'],

  endpoints: (builder) => ({
    //? -- GET INCOME
    getIncome: builder.query({
      query: (incomeId) => `${URL}/getIncome/${incomeId}`,
      credentials: 'include',
      providesTags: ['Income'],
    }),
    //? -- GET ALL INCOMES
    getAllIncomes: builder.query({
      query: () => ({
        url: `${URL}/getAllIncomes`,
        credentials: 'include',
      }),
      providesTags: ['Income'],
    }),
    //? -- ADD INCOME
    addIncome: builder.mutation({
      query: (data) => ({
        url: `${URL}/addIncome`,
        method: 'POST',
        credentials: 'include',
        body: data,
      }),
      invalidatesTags: ['Income'],
    }),
    //? -- UPDATE INCOME
    updateIncome: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `${URL}/updateIncome/${_id}`,
        method: 'PATCH',
        credentials: 'include',
        body: rest,
      }),
      invalidatesTags: ['Income'],
    }),
    //? -- DELETE INCOME
    deleteIncome: builder.mutation({
      query: (incomeId) => ({
        url: `${URL}/deleteIncome/${incomeId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Income'],
    }),
  }),
});
export const {
  useGetIncomeQuery,
  useGetAllIncomesQuery,
  useAddIncomeMutation,
  useDeleteIncomeMutation,
  useUpdateIncomeMutation,
} = incomeApiSlice;
