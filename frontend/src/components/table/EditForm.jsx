import { Edit } from "@mui/icons-material";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-hot-toast";

const EditForm = ({ item, actionType }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setNewAction({
      _id: item._id,
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: item.date,
    });
    setShow(true);
  };

  const [newAction, setNewAction] = useState({
    _id: "",
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const update = async (e) => {
    e.preventDefault();

    switch (actionType) {
      case "income":
        // await updateIncome(newAction);
        handleClose();
        return toast.success("Successfully added Income");

      case "expense":
        // await updateExpense(newAction);
        handleClose();
        return toast.success("Successfully added Expense");
      default:
        return null;
    }
  };

  return (
    <>
      <button style={{ backgroundColor: "green", borderRadius: "5px" }} className="btn_Upd_dlt" onClick={handleShow}>
        <Edit />
      </button>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} className="mt-5">
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="addForm" onSubmit={update}>
            {/*//@ ---->TITLE  <---- */}
            <div className="form-group ">
              <label className="label ms-1">Title</label>
              <input
                value={newAction.title}
                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                input
                type="text"
                required={true}
                className="form-control  "
              />
            </div>
            {/*//@ ----> AMOUNT  <---- */}
            <div className="form-group ">
              <label className="label ms-1">Amount</label>
              <input
                onChange={(e) => setNewAction({ ...newAction, amount: e.target.value })}
                value={newAction.amount}
                type="text"
                required={true}
                className=" form-control"
              />
            </div>
            {/*//@ ---->  DATE  <---- */}
            <div className="form-group ">
              <label className="label ms-1">Date</label>
              <input
                onChange={(e) => setNewAction({ ...newAction, date: e.target.value })}
                value={newAction.date}
                type="date"
                required={true}
                className=" form-control"
              />
            </div>
            {/*//@ ----> CATEGORY  <---- */}
            <div className="form-group ">
              <label className="label ms-1">Category</label>
              <select
                value={newAction.category}
                style={{
                  paddingTop: "0.375rem",
                  paddingBottom: "0.375rem",
                  border: "1px solid #dee2e6",
                  borderRadius: "5px",
                  width: "100%",
                }}
                onChange={(e) => setNewAction({ ...newAction, category: e.target.value })}
              >
                {/* {actionType === "expense"
                  ? expCategories.map((category) => {
                      return (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      );
                    })
                  : incCategories.map((category) => {
                      return (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      );
                    })} */}
              </select>
            </div>

            <div className="btnSumbit d-flex justify-content-end mt-5 ">
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditForm;
