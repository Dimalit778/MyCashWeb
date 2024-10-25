import React, { useEffect } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInput from "components/custom/TextInput";
import { useTransactionContext } from "./TransactionProvider";
import SelectInput from "components/custom/SelectInput";
import MyButton from "components/custom/MyButton";

const TransactionForm = () => {
  const { modalType, editingItem, closeModal, handleTransaction, type, categories } = useTransactionContext();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  useEffect(() => {
    if (modalType === null) {
      reset({
        name: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    } else if (editingItem) {
      reset({
        ...editingItem,
        date: new Date(editingItem.date).toISOString().split("T")[0],
      });
    }
  }, [modalType, editingItem, reset]);

  const onSubmit = async (data) => {
    try {
      // Convert amount to number
      const formData = {
        ...data,
        amount: Number(data.amount),
        _id: editingItem?._id,
      };
      await handleTransaction(formData);
      closeModal(); // Only close if successful
    } catch (err) {
      console.error(err);
      console.log("Error submitting form:", err);
      // Don't close modal if there's an error
    }
  };

  return (
    <Modal show={!!modalType} onHide={closeModal} contentClassName="bg-dark" className="mt-5">
      <Modal.Header closeButton>
        <Modal.Title>{modalType === "add" ? `Add ${type}` : `Edit ${type}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} className="bg-dark">
          <Row>
            <Col>
              <TextInput
                name="name"
                control={control}
                label="Name"
                rules={{ required: "Name is required" }}
                className="form-control"
              />
            </Col>
            <Col>
              <TextInput
                name="amount"
                control={control}
                label="Amount"
                type="number"
                step="0.01"
                rules={{
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" },
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <TextInput name="date" control={control} label="Date" type="date" />
            </Col>
            <Col>
              <SelectInput
                name="category"
                control={control}
                label="Category"
                options={categories}
                rules={{ required: "Category is required" }}
              />
            </Col>
          </Row>
          <Row>
            <TextInput name="description" control={control} label="Description" />
          </Row>

          <MyButton type="submit" bgColor="orange" color="black">
            {modalType === "add" ? "Create" : "Update"}
          </MyButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionForm;
