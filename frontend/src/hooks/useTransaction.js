import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetMonthlyTransactionsQuery,
  useUpdateTransactionMutation,
} from "api/slicesApi/transactionsApiSlice";
import { useGetCategoriesQuery } from "services/api/userApi";
import {
  setDate,
  setModalType,
  setEditingItem,
  resetModal,
  selectDate,
  selectModalType,
  selectEditingItem,
} from "../services/store/transactionSlice";

export const useTransaction = (type) => {
  const dispatch = useDispatch();
  const date = useSelector(selectDate);
  const modalType = useSelector(selectModalType);
  const editingItem = useSelector(selectEditingItem);

  const formattedDate = format(date, "yyyy-MM-dd");

  // RTK Query hooks
  const { data, isLoading, error } = useGetMonthlyTransactionsQuery({
    date: formattedDate,
    type,
  });
  console.log("useTransaction data", data);
  const { data: categoriesData } = useGetCategoriesQuery();
  const [addTransaction] = useAddTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const categories = categoriesData ? (type === "Income" ? categoriesData.incomes : categoriesData.expenses) : [];

  const openAddModal = useCallback(() => {
    dispatch(setModalType("add"));
    dispatch(setEditingItem(null));
  }, [dispatch]);

  const openEditModal = useCallback(
    (item) => {
      dispatch(setModalType("edit"));
      dispatch(setEditingItem(item));
    },
    [dispatch]
  );

  const closeModal = useCallback(() => {
    dispatch(resetModal());
  }, [dispatch]);

  const handleTransaction = useCallback(
    async (transactionData) => {
      try {
        if (modalType === "add") {
          await addTransaction({ ...transactionData, type }).unwrap();
        } else {
          await updateTransaction({ ...transactionData, type }).unwrap();
        }
        closeModal();
      } catch (err) {
        console.error(`Error ${modalType === "add" ? "adding" : "updating"} transaction:`, err);
        throw err;
      }
    },
    [modalType, addTransaction, updateTransaction, type, closeModal]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteTransaction({ id, type }).unwrap();
        toast.success("Transaction deleted successfully");
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        toast.error("Failed to delete transaction");
      }
    },
    [deleteTransaction, type]
  );

  const handleDateChange = useCallback(
    (newDate) => {
      dispatch(setDate(newDate));
    },
    [dispatch]
  );

  return {
    date,
    setDate: handleDateChange,
    data,
    isLoading,
    error,
    type,
    modalType,
    editingItem,
    categories,
    openAddModal,
    openEditModal,
    closeModal,
    handleTransaction,
    handleDelete,
  };
};
