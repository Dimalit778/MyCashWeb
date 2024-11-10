import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "components/ui/IconButton";
import MyButton from "components/ui/MyButton";
import { Theme } from "utils/constants";
import "styles/CategoriesStyle.css";
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from "api/slicesApi/userApiSlice";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
const MAX_CATEGORIES = 8;

const Categories = () => {
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const [newIncomeCategory, setNewIncomeCategory] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleAdd = async (type, category) => {
    if (categories[type].includes(category)) return toast.error("Category already exists");
    if (categories[type].length >= 8) return toast.error("Maximum number of categories reached");
    try {
      await addCategory({ type, category }).unwrap();
      setNewIncomeCategory("");
      setNewExpenseCategory("");
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleDelete = async (type, category) => {
    Swal.fire({
      title: "Delete Category?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory({ type, category }).unwrap();
        } catch (error) {
          console.error("Failed to delete category:", error);
        }
      }
    });
  };

  if (categoriesLoading) return <div>Loading...</div>;

  const renderCategoryList = (type, title) => (
    <div className="my-card">
      <div className="d-flex justify-content-between">
        <div className="my-card-header">{title}</div>
        <p className="my-card-header">
          {categories[type].length} / {MAX_CATEGORIES}
        </p>
      </div>

      <div className="my-card-body">
        <div className="my-card-list">
          {categories[type].map((category, index) => (
            <div key={index} className="my-card-item">
              <span>{category}</span>
              <IconButton
                icon={<FontAwesomeIcon icon={faXmark} />}
                color="white"
                bgColor="red"
                onClick={() => handleDelete(type, category)}
              />
            </div>
          ))}
        </div>
        {categories[type].length < MAX_CATEGORIES && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd(type, type === "incomes" ? newIncomeCategory : newExpenseCategory);
            }}
            className="mt-3 d-flex align-items-center"
          >
            <input
              type="text"
              placeholder={`Add new ${title.toLowerCase()}`}
              value={type === "incomes" ? newIncomeCategory : newExpenseCategory}
              onChange={(e) =>
                type === "incomes" ? setNewIncomeCategory(e.target.value) : setNewExpenseCategory(e.target.value)
              }
              className="form-input"
            />
            <MyButton type="submit" bgColor={Theme.orange} color="white">
              Add
            </MyButton>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="row g-3 mt-3">
      <div className="col-md-6">{renderCategoryList("incomes", "Income Categories")}</div>
      <div className="col-md-6">{renderCategoryList("expenses", "Expense Categories")}</div>
    </div>
  );
};

export default Categories;
