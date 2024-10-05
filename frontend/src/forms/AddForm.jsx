import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { expCategories } from "../hooks/categoryList.js";
import { incCategories } from "../hooks/incomeCateList.js";
import useModal from "../hooks/useModal";
import { useAddIncomeMutation } from "api/slicesApi/incomeApiSlice.js";
import { useAddExpenseMutation } from "api/slicesApi/expenseApiSlice.js";
import MyButton from "components/MyButton.jsx";

const ACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
};

const AddForm = ({ actionType }) => {
  const [addIncome] = useAddIncomeMutation();
  const [addExpense] = useAddExpenseMutation();
  const { isOpen, openModal, closeModal } = useModal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const amount = parseFloat(data.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Amount must be a positive number!");
        return;
      }

      const formattedData = {
        ...data,
        amount: amount,
      };

      const action = actionType === ACTION_TYPES.INCOME ? addIncome : addExpense;
      const result = await action(formattedData);

      if ("error" in result) {
        console.error("API Error:", result.error);
        toast.error("Error adding item. Please try again.");
      } else {
        toast.success("Successfully added");
        closeModal();
        reset();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <MyButton bgColor="grey" onClick={openModal}>
        Add New
      </MyButton>
      <Modal show={isOpen} onHide={closeModal} contentClassName="bg-dark text-light">
        <Modal.Header closeButton className="border-secondary">
          <Modal.Title>Add new {actionType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                {...register("title", { required: "Title is required" })}
                className="bg-secondary text-light border-dark"
              />
              {errors.title && <Form.Text className="text-danger">{errors.title.message}</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" },
                })}
                className="bg-secondary text-light border-dark"
              />
              {errors.amount && <Form.Text className="text-danger">{errors.amount.message}</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                {...register("date", { required: "Date is required" })}
                className="bg-secondary text-light border-dark"
              />
              {errors.date && <Form.Text className="text-danger">{errors.date.message}</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                {...register("category", { required: "Category is required" })}
                className="bg-secondary text-light border-dark"
              >
                <option value="">Select a category</option>
                {(actionType === ACTION_TYPES.EXPENSE ? expCategories : incCategories).map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Form.Select>
              {errors.category && <Form.Text className="text-danger">{errors.category.message}</Form.Text>}
            </Form.Group>
            <Button type="submit" variant="outline-light">
              Add new
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddForm;
