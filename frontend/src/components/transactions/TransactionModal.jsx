// src/features/transactions/components/TransactionModal/index.jsx
import React, { useEffect } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeTransactionModal, selectedDateObject, transactionModal } from "services/reducers/uiSlice";

import TextInput from "components/ui/textInput";
import SelectInput from "components/ui/selectInput";
import MyButton from "components/ui/button";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useAddTransactionMutation, useUpdateTransactionMutation } from "services/api/transactionsApi";

const TransactionModal = () => {
  const { type } = useParams();
  const dispatch = useDispatch();
  const modalState = useSelector(transactionModal);
  const selectedDate = useSelector(selectedDateObject);
  const categories = [];
  const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      category: "",
      description: "",
      date: format(new Date(selectedDate), "yyyy-MM-dd"),
    },
  });

  // Reset form when modal state changes
  useEffect(() => {
    if (modalState.isOpen) {
      const defaultData = modalState.data
        ? {
            ...modalState.data,
            date: format(new Date(modalState.data.date), "yyyy-MM-dd"),
          }
        : {
            name: "",
            amount: "",
            category: "",
            description: "",
            date: format(new Date(selectedDate), "yyyy-MM-dd"),
          };
      reset(defaultData);
    }
  }, [modalState.isOpen, modalState.data, selectedDate, reset]);

  const handleClose = () => {
    dispatch(closeTransactionModal());
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        amount: Number(data.amount),
        type,
        date: selectedDate,
      };

      if (modalState.editingId) {
        await updateTransaction({
          ...formattedData,
          _id: modalState.editingId,
        }).unwrap();
        toast.success(`${type} updated successfully`);
      } else {
        await addTransaction(formattedData).unwrap();
        toast.success(`${type} added successfully`);
      }

      handleClose();
    } catch (error) {
      const errorMessage = error.data?.message || "Failed to save transaction";
      toast.error(errorMessage);

      // Set specific field errors if they exist
      if (error.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, message]) => {
          setError(field, { type: "manual", message });
        });
      }
    }
  };

  // if (isCategoriesLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <Modal show={modalState.isOpen} onHide={handleClose} contentClassName="bg-dark" className="mt-5" backdrop="static">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="text-light">{modalState.editingId ? `Edit ${type}` : `Add ${type}`}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} className="bg-dark">
          <Row className="mb-3">
            <Col md={6}>
              <TextInput
                name="name"
                control={control}
                label="Name"
                rules={{
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
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
                step="0.01"
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
                rules={{
                  required: "Category is required",
                }}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <TextInput
                name="description"
                control={control}
                label="Description"
                as="textarea"
                rules={{
                  maxLength: {
                    value: 500,
                    message: "Description must be less than 500 characters",
                  },
                }}
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <MyButton type="button" bgColor="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </MyButton>
            <MyButton type="submit" bgColor="orange" color="black" disabled={isSubmitting || isAdding || isUpdating}>
              {isSubmitting || isAdding || isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {modalState.editingId ? "Updating..." : "Creating..."}
                </>
              ) : modalState.editingId ? (
                "Update"
              ) : (
                "Create"
              )}
            </MyButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
