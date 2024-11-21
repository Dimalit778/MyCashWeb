import { useState } from "react";

import { useAddCategoryMutation, useDeleteCategoryMutation } from "services/api/categoriesApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const useCategories = () => {
  const [newCategory, setNewCategory] = useState("");

  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleAdd = async (label, type) => {
    try {
      await addCategory({ label, type }).unwrap();
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error(error.data?.message || "Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        // Pass category as categoryId since that's what your API expects
        await deleteCategory({
          id,
        }).unwrap();
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error(error.data?.message || "Failed to delete category");
      }
    }
  };

  return {
    newCategory,
    setNewCategory,
    handleAdd,
    handleDelete,
  };
};
