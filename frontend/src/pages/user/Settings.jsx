import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDeleteUserMutation } from "api/slicesApi/userApiSlice.js";

import UploadImage from "forms/UploadImage";

import MyButton from "components/custom/MyButton";
import useAuth from "hooks/useAuth";

const Settings = () => {
  const { userInfo, logout } = useAuth();
  const [deleteUser] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [user, setUser] = useState(userInfo.user);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const deleteAlert = () => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "All your data will be deleted",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Delete Account",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       handleDelete();
  //     }
  //   });
  // };

  const handleDelete = async () => {
    try {
      await deleteUser();
      await logout();
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
  const handleSubmit = (event) => {
    console.log("submit");
    setTimeout(() => {
      console.log("true");
      setLoading(true);
    }, 3000);
    setLoading(false);
    console.log("false");

    // event.preventDefault();
    // if (newPassword !== confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }
    // setIsEditing(false);
    // setNewPassword("");
    // setConfirmPassword("");
    // setError("");
  };
  const handleClick = () => {
    setLoading(true);
    // Simulating an async operation
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <Container fluid className="text-light py-3 bg-primary ">
      <Row className="p-3">
        <UploadImage />
      </Row>
      <Row className="p-4 mt-3 text-light ">
        <form onSubmit={handleSubmit} className="p-4 border border-1 border-secondary rounded">
          <Row className="mb-3 border-bottom border-secondary ">
            {/* first name */}
            <Col className="mb-3 ">
              <label htmlFor="firstName" className=" col-form-label">
                First Name
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control bg-secondary text-light border-dark"
                  id="firstName"
                  value={user.name}
                  onChange={(e) => setUser((prev) => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </Col>
            {/* last name */}
            <Col className="mb-3 ">
              <label htmlFor="lastName" className="col-form-label">
                Last Name
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control bg-secondary text-light border-dark"
                  id="lastName"
                  value={user.name}
                  onChange={(e) => setUser((prev) => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </Col>
          </Row>

          <Row className="py-3  border-bottom border-secondary ">
            <Col md={6}>
              <label htmlFor="email" className="col-form-label">
                Email
              </label>
              <div className="col-sm-9 ">
                <input
                  type="email"
                  className="form-control bg-secondary text-light border-dark"
                  id="email"
                  value={user.email}
                  onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </Col>
          </Row>
          {isEditing && (
            <Row className="py-3 border-bottom border-secondary ">
              <Col md={6} className="mb-3">
                <label htmlFor="newPassword" className="col-sm-3 col-form-label">
                  New Password
                </label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    className="form-control bg-secondary text-light border-dark"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </Col>
              <Col md={6} className="mb-3 ">
                <label htmlFor="confirmPassword" className="col-sm-3 col-form-label">
                  Confirm Password
                </label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    className="form-control bg-secondary text-light border-dark"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="py-3 mx-3 gap-2 text-end">
            {isEditing ? (
              <>
                <MyButton className="me-3" color={"danger"} onClick={() => setIsEditing(false)}>
                  Cancel
                </MyButton>
                <MyButton color="blue" isLoading={loading} onClick={handleClick}>
                  Save Changes
                </MyButton>
              </>
            ) : (
              <MyButton onClick={() => setIsEditing(true)}>Edit Profile</MyButton>
            )}
          </div>
        </form>
      </Row>
    </Container>
  );
};

export default Settings;
