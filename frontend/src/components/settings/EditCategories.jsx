import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "components/custom/IconButton";
import MyButton from "components/custom/MyButton";
import { Theme } from "constants/colors";
import "./settings.css";
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from "api/slicesApi/userApiSlice";
import Loader from "components/loader/Loader";

export default function EditCategories() {
  const { data: categories } = useGetCategoriesQuery();

  const [newIncomeCategory, setNewIncomeCategory] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  if (!categories) return <Loader />;

  const handleAdd = async (type, category) => {
    try {
      await addCategory({ type, category }).unwrap();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleDelete = async (type, category) => {
    try {
      await deleteCategory({ type, category }).unwrap();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const renderCategoryList = (type, title) => (
    <div className="my-card">
      <div className="my-card-header">{title}</div>
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
          <MyButton type="submit" isLoading={isLoading} bgColor={Theme.orange} color="white">
            Add
          </MyButton>
        </form>
      </div>
    </div>
  );

  return (
    <Container fluid className="edit-categories-container">
      <Row>
        <Col md={6}>{renderCategoryList("incomes", "Income Categories")}</Col>
        <Col md={6}>{renderCategoryList("expenses", "Expense Categories")}</Col>
      </Row>
    </Container>
  );
}
