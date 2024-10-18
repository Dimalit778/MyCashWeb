import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import CategoryPicker from "./CategoryPicker";
import toast from "react-hot-toast";
import MyButton from "components/custom/MyButton";
import { useAddTransactionMutation } from "api/slicesApi/transactionsApiSlice";

const AddForm = ({ type, closeModal }) => {
  const [addTransaction] = useAddTransactionMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
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
        type: type,
      };
      const result = await addTransaction(formattedData).unwrap();
      if ("error" in result) {
        console.error("API Error:", result.error);
        toast.error("Error adding item. Please try again.");
      } else {
        toast.success("Successfully added");
        reset();
        closeModal();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="bg-dark">
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          {...register("title", { required: "Title is required" })}
          className="bg-secondary text-black border-dark"
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
          className="bg-secondary text-black border-dark"
        />
        {errors.amount && <Form.Text className="text-danger">{errors.amount.message}</Form.Text>}
      </Form.Group>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" {...register("date")} className="bg-secondary text-black border-dark" />
            {errors.date && <Form.Text className="text-danger">{errors.date.message}</Form.Text>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => <CategoryPicker type={type} value={field.value} onChange={field.onChange} />}
            />
            {errors.category && <Form.Text className="text-danger">{errors.category.message}</Form.Text>}
          </Form.Group>
        </Col>
      </Row>

      <MyButton type="submit" bgColor="orange" color="black" isLoading={isSubmitting} disabled={isSubmitting}>
        Create
      </MyButton>
    </Form>
  );
};

export default AddForm;
