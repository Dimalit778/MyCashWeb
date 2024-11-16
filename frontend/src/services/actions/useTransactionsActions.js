import toast from "react-hot-toast";
import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "services/api/transactionsApi";

export const useTransactionActions = () => {
  const [addTransaction] = useAddTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleAdd = async (data) => {
    try {
      await addTransaction(data).unwrap();
      toast.success("Transaction added successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to add transaction");
      throw error;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateTransaction(data).unwrap();
      toast.success("Transaction updated successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to update transaction");
      throw error;
    }
  };

  const handleDelete = async (data) => {
    try {
      await deleteTransaction(data).unwrap();
      toast.success("Transaction deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete transaction");
      throw error;
    }
  };

  return {
    handleAdd,
    handleUpdate,
    handleDelete,
  };
};
