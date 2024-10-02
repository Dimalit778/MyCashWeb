import React from "react";
import "./settings.css";
import Swal from "sweetalert2";
import { UpdateUser } from "forms/UpdateUser";
import { useDispatch, useSelector } from "react-redux";
import UploadImage from "forms/UploadImage";

import { Col, Container, Row } from "react-bootstrap";
import { useDeleteUserMutation, useLogoutMutation } from "api/slicesApi/userApiSlice.js";

import { useNavigate } from "react-router-dom";
import { logout } from "api/slicesApi/authSlice.js";

const Settings = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [deleteUser] = useDeleteUserMutation();
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteAlert = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "All your data will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete Account",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      await logoutApiCall().unwrap();
      dispatch(logout());
      Swal.fire({
        title: "Deleted!",
        text: "Your Account has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Container fluid className="settings">
      <Row className=" p-5">
        <h1 className="header text-center pb-5 "> Settings</h1>
        <Col sm={6} className="user pb-4">
          {/* Upload Image Component */}
          <div className="">
            <UploadImage />
          </div>
          <div className="userInfo d-flex flex-column  ">
            <p className=" mx-auto text-capitalize">{userInfo.name}</p>
            <p className="mx-auto  ">{userInfo.email}</p>
          </div>
        </Col>
        <Col sm={6} className="">
          <UpdateUser />
        </Col>
      </Row>
      <div className=" text-center p-3 ">
        <button className="deleteAccountBtn" onClick={() => deleteAlert()}>
          <span>Delete Account</span>
        </button>
      </div>
    </Container>
  );
};

export default Settings;
