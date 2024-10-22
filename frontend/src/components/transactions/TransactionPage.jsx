import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetMonthlyTransactionsQuery,
  useUpdateTransactionMutation,
} from "api/slicesApi/transactionsApiSlice";
import { useGetCategoriesQuery } from "api/slicesApi/userApiSlice";
import FinanceSkeleton from "components/loader/FinanceSkeleton";
import { format } from "date-fns";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TransactionPageContext = createContext();

export function useTransactionPageContext() {
  const context = useContext(TransactionPageContext);
  if (context === undefined) {
    throw new Error("useTransactionPageContext must be used within a TransactionPageProvider");
  }
  return context;
}

export function TransactionPageProvider({ children, type }) {
  const [date, setDate] = useState(new Date());
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const formattedDate = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

  const { data, isLoading, error } = useGetMonthlyTransactionsQuery({
    date: formattedDate,
    type,
  });
  const { data: categoriesData } = useGetCategoriesQuery();

  const categories = useMemo(
    () => (categoriesData ? (type === "Income" ? categoriesData.incomes : categoriesData.expenses) : []),
    [categoriesData, type]
  );

  const [addTransaction] = useAddTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const openAddModal = useCallback(() => {
    setModalType("add");
    setEditingItem(null);
  }, []);

  const openEditModal = useCallback((item) => {
    setModalType("edit");
    setEditingItem(item);
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setEditingItem(null);
  }, []);

  const handleTransaction = useCallback(
    async (transactionData) => {
      try {
        if (modalType === "add") {
          await addTransaction({ ...transactionData, type });
        } else {
          await updateTransaction({ ...transactionData, type });
        }
        closeModal();
      } catch (err) {
        console.error(`Error ${modalType === "add" ? "adding" : "updating"} transaction:`, err);
        // Handle error (e.g., show toast notification)
      }
    },
    [modalType, addTransaction, updateTransaction, type, closeModal]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteTransaction({ id, type });
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        // Handle error (e.g., show toast notification)
      }
    },
    [deleteTransaction, type]
  );

  if (isLoading) return <FinanceSkeleton />;

  const value = {
    date,
    setDate,
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

  return <TransactionPageContext.Provider value={value}>{children}</TransactionPageContext.Provider>;
}
