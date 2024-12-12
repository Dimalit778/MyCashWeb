import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSquarePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "components/ui/icon";
import MyButton from "components/ui/button";
import "./categoriesStyle.css";

import { useAddCategoryMutation, useDeleteCategoryMutation } from "services/api/categoriesApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Categories = ({ categories, max }) => {
  const { type } = useParams();

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = async (name, type) => {
    if (!name) return toast.error("Category name is required");
    try {
      await addCategory({ name, type }).unwrap();
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Delete Category?",
        text: "This action cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await deleteCategory({ id }).unwrap();
        toast.success("Category deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.data.message);
      return false;
    }
  };

  return (
    <div className="my-card bg-dark ">
      <div className="d-flex justify-content-between align-items-center mb-4 ">
        <p className="fw-bold fs-5">{type.charAt(0).toUpperCase() + type.slice(1)} Categories</p>

        <p className="px-2 bg-secondary rounded fw-bold fs-6">
          {categories?.length} / {max}
        </p>
      </div>

      <div className="my-card-body">
        <div
          className="d-grid gap-2"
          style={{
            gridTemplateColumns: categories?.length > 5 ? "repeat(2, 1fr)" : "1fr",
          }}
        >
          {categories?.map((category) => (
            <div key={category._id} className="my-card-item">
              <span>{category.name}</span>
              <IconButton
                onClick={() => handleDelete(category._id)}
                icon={<FontAwesomeIcon icon={faXmark} />}
                color="red"
                size="lg"
                hoverBgColor="rgba(60, 60, 60, 0.8)"
              />
            </div>
          ))}
        </div>

        {categories?.length < max && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd(newCategory, type);
            }}
            className="mt-3"
          >
            <div className="mb-3 border-bottom border-3 border-secondary "></div>
            <div className="d-flex  gap-2">
              <input
                type="text"
                placeholder={`Add new category ...`}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="form-input w-100    px-3 py-2 rounded"
              />
              <MyButton type="submit" isLoading={isAdding || isDeleting} size="none">
                <FontAwesomeIcon icon={faPlus} style={{ fontSize: "1.5rem" }} />
              </MyButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Categories;
