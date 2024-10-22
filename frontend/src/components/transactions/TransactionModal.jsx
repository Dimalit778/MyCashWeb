import React, { useEffect } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInput from "components/custom/TextInput";
import { useTransactionPageContext } from "./TransactionPage";
import SelectInput from "components/custom/SelectInput";
import MyButton from "components/custom/MyButton";

const TransactionForm = () => {
  const { modalType, editingItem, closeModal, handleTransaction, type, categories } = useTransactionPageContext();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (modalType === null) {
      reset({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    } else if (editingItem) {
      reset({
        ...editingItem,
        date: new Date(editingItem.date).toISOString().split("T")[0],
      });
    }
  }, [modalType, editingItem, reset]);

  const onSubmit = (data) => {
    handleTransaction(editingItem ? { ...data, _id: editingItem._id } : data);
    closeModal();
  };

  return (
    <Modal show={!!modalType} onHide={closeModal} contentClassName="bg-dark" className="mt-5">
      <Modal.Header closeButton>
        <Modal.Title>{modalType === "add" ? `Add ${type}` : `Edit ${type}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} className="bg-dark">
          <TextInput name="title" control={control} label="Title" rules={{ required: "Title is required" }} />

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

          <MyButton type="submit" bgColor="orange" color="black">
            Create
          </MyButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionForm;
