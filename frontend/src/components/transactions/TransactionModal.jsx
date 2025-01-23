// src/features/transactions/components/TransactionModal/index.jsx
import React, { useEffect, useMemo } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeTransactionModal, transactionModal } from "services/reducers/uiSlice";
import TextInput from "components/ui/textInput";
import SelectInput from "components/ui/selectInput";
import MyButton from "components/ui/button";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { useAddTransactionMutation, useUpdateTransactionMutation } from "services/api/transactionsApi";

const TransactionModal = ({ type, date, categories }) => {
  const dispatch = useDispatch();
  const { isOpen, editItem } = useSelector(transactionModal);

  const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();

  const defaultValues = useMemo(
    () => ({
      description: editItem?.description || "",
      amount: editItem?.amount || "",
      category: editItem?.category?.name || "",

      date: format(editItem?.date ? new Date(editItem.date) : date, "yyyy-MM-dd"),
    }),
    [editItem, date]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setError,
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset, defaultValues]);
  const handleClose = () => {
    dispatch(closeTransactionModal());
    reset(defaultValues);
  };
  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        amount: Number(data.amount),
        type,

        category: data.category || editItem?.category,
        date: new Date(data.date),
      };

      if (editItem) {
        await updateTransaction({
          ...formattedData,
          _id: editItem._id,
        }).unwrap();
        toast.success(`${type} updated`);
      } else {
        await addTransaction(formattedData).unwrap();
        toast.success(`${type} added`);
      }
      handleClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to save");
      if (error.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, message]) => {
          setError(field, { message });
        });
      }
    }
  };

  return (
    <Modal show={isOpen} onHide={handleClose} contentClassName="bg-dark" className="mt-5" backdrop="static">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="text-light">{editItem ? `Edit ${type}` : `Add ${type}`}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} className="bg-dark">
          <Row className="mb-3">
            <Col md={6}>
              <TextInput
                name="description"
                control={control}
                label="Description"
                placeholder="Enter description"
                rules={{
                  required: "Description is required",
                  minLength: {
                    value: 2,
                    message: "Description must be at least 2 characters",
                  },
                }}
              />
            </Col>
            <Col md={6}>
              <TextInput
                name="amount"
                control={control}
                label="Amount"
                type="number"
                placeholder="0.00"
                rules={{
                  required: "Amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                  validate: {
                    isNumber: (value) => !isNaN(value) || "Please enter a valid number",
                  },
                }}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" {...field} isInvalid={!!error} className="bg-dark text-light" />
                    <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
                  </Form.Group>
                )}
              />
            </Col>
            <Col md={6}>
              <SelectInput
                name="category"
                control={control}
                label="Category"
                options={categories}
                renderOption={(option) => ({
                  value: option.name,
                  label: `${option.name}${option.isDeleted ? " (deleted)" : ""}`,
                })}
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <MyButton type="submit" disabled={isSubmitting || isAdding || isUpdating}>
              {isSubmitting || isAdding || isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {editItem ? "Updating..." : "Creating..."}
                </>
              ) : editItem ? (
                "Update"
              ) : (
                "Create"
              )}
            </MyButton>
            <MyButton
              type="button"
              bgColor="gray"
              color="black"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </MyButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
