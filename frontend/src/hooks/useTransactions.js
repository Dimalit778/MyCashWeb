// hooks/useTransactions.js
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetMonthlyTransactionsQuery,
  useUpdateTransactionMutation,
} from "services/api/transactionsApi";
import { selectedDateObject } from "services/reducers/uiSlice";

export const useTransactions = (type) => {
  const selectedDate = useSelector(selectedDateObject);
  const year = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth() + 1;

  const skip = !year;
  const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();

  const {
    data: yearlyData,
    isLoading: isFetching,
    error,
  } = useGetMonthlyTransactionsQuery(
    { year },
    {
      skip,
      pollingInterval: 0,
      refetchOnMountOrArgChange: false,
    }
  );

  const monthlyData = useMemo(() => {
    const defaultData = {
      month: currentMonth,
      total: 0,
      categories: [],
      transactions: [],
    };

    if (!yearlyData?.result?.length) return defaultData;

    const monthData = yearlyData.result.find((item) => item.month === currentMonth);
    if (!monthData) return defaultData;

    return {
      month: monthData.month,
      total: monthData[type]?.total || 0,
      categories: monthData[type]?.categories || [],
      transactions: monthData[type]?.transactions || [],
    };
  }, [yearlyData?.result, currentMonth, type]);

  const handleAction = async (action, data, successMessage) => {
    try {
      await action(data).unwrap();
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.data?.message || "Operation failed");
      throw error;
    }
  };

  return {
    data: monthlyData,
    error,
    isLoading: {
      fetch: isFetching,
      add: isAdding,
      update: isUpdating,
      delete: isDeleting,
    },
    addTransaction: (data) => handleAction(addTransaction, data, "Transaction added successfully"),
    updateTransaction: (data) => handleAction(updateTransaction, data, "Transaction updated successfully"),
    deleteTransaction: (data) => handleAction(deleteTransaction, data, "Transaction deleted successfully"),
  };
};
