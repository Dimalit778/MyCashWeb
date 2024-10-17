import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAddTransactionMutation } from "api/slicesApi/transactionsApiSlice.js";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "config/authSlice";
import "./tableStyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MyButton from "components/custom/MyButton";

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="form-control bg-secondary text-black border-dark" onClick={onClick} ref={ref}>
    {value || "Select a date"}
    <span className="mx-2">📅</span>
  </div>
));

const AddForm = ({ type, closeModal }) => {
  const user = useSelector(selectCurrentUser);
  const [categories, setCategories] = useState([]);
  const [addTransaction, { isLoading }] = useAddTransactionMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Initialize categories based on the transaction type
    setCategories(type === "Income" ? user.categories.incomes : user.categories.expenses);
  }, [type, user.categories]);

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
  const addCategory = (category) => {
    console.log("add category", category);
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

      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Date is required" }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              selected={value}
              onChange={onChange}
              dateFormat="dd/MM/yyyy"
              wrapperClassName="w-100"
              customInput={<CustomInput />}
              calendarClassName="custom-datepicker"
            />
          )}
        />
        {errors.date && <Form.Text className="text-danger">{errors.date.message}</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <>
              <Form.Select {...field} className="mb-2 bg-secondary text-black border-dark">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="new">Add new category</option>
              </Form.Select>
              {field.value === "new" && (
                <div className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder="New category name"
                    className="bg-secondary text-black border-dark"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (e.target.value && !categories.includes(e.target.value)) {
                          setCategories([...categories, e.target.value]);
                          field.onChange(e.target.value);
                        }
                      }
                    }}
                  />
                </div>
              )}
            </>
          )}
        />
        {errors.category && <Form.Text className="text-danger">{errors.category.message}</Form.Text>}
      </Form.Group>

      <MyButton type="submit" bgColor="orange" color="black" isLoading={isLoading} disabled={isLoading}>
        Create
      </MyButton>
    </Form>
  );
};

export default AddForm;
