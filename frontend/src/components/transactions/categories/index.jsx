import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "components/ui/icon";
import MyButton from "components/ui/button";
import "./categoriesStyle.css";

import { useAddCategoryMutation, useDeleteCategoryMutation } from "services/api/categoriesApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import TextInput from "components/ui/textInput";
import { useForm } from "react-hook-form";

const Categories = ({ categories, max }) => {
  const { type } = useParams();

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const { control, handleSubmit, setError, reset } = useForm({
    defaultValues: {
      category: "",
    },
    mode: "onBlur",
    shouldUnregister: true,
  });

  const onSubmit = async (data) => {
    const name = data.category?.trim();

    if (!name) {
      setError("category", {
        type: "required",
        message: "Enter category name",
      });
      return;
    }

    try {
      await addCategory({ name, type }).unwrap();
      toast.success("Category added successfully");
      reset();
    } catch (error) {
      setError("category", {
        type: "server",
        message: error.data?.message || "Failed to add category",
      });
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
        <p data-cy="categories-title" className="fw-bold fs-5">
          {type.charAt(0).toUpperCase() + type.slice(1)} Categories
        </p>

        <p data-cy="categories-max" className="px-2 bg-secondary rounded fw-bold fs-6">
          {categories?.length} / {max}
        </p>
      </div>

      <div className="my-card-body">
        <div
          data-cy="categories-list"
          className="d-grid gap-2"
          style={{
            gridTemplateColumns: categories?.length > 5 ? "repeat(2, 1fr)" : "1fr",
          }}
        >
          {categories?.map((category) => (
            <div data-cy="category-item" key={category._id} className="my-card-item">
              <span data-cy="category-name">{category.name}</span>
              <IconButton
                data-cy="delete-category-btn"
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
          <form data-cy="add-category-form" onSubmit={handleSubmit(onSubmit)} className="mt-3">
            <div className="mb-3 border-bottom border-3 border-secondary"></div>
            <div className="d-flex gap-2 ">
              <div className="flex-grow-1">
                <TextInput
                  data-cy="category-input"
                  name="category"
                  control={control}
                  type="text"
                  placeholder="Enter category name..."
                  className="form-control"
                />
              </div>

              <MyButton data-cy="submit-category" type="submit" isLoading={isAdding || isDeleting} size="md">
                <FontAwesomeIcon icon={faPlus} />
              </MyButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Categories;
