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
import toast from "react-hot-toast";

const TransactionContext = createContext();

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactionPageContext must be used within a TransactionPageProvider");
  }
  return context;
}

export function TransactionProvider({ children, type }) {
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
        throw err; // Re-throw the error to be caught in the form
      }
    },
    [modalType, addTransaction, updateTransaction, type, closeModal]
  );
  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteTransaction({ id, type });
        toast.success("Transaction deleted successfully");
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        toast.error("Failed to delete transaction");
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

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}
