import MyButton from "components/ui/button";
import { THEME } from "constants/Theme";

import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { currentUser } from "services/reducers/userSlice";

export default function EditProfile() {
  const userInfo = useSelector(currentUser);

  const [user, setUser] = useState(userInfo);

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputStyle = {
    backgroundColor: "#1e1e1e",

    border: "1px solid #444",
    borderRadius: "4px",
    padding: "6px 10px",
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    // Simulating an async operation
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }, 2000);
  };

  return (
    <Container fluid className="p-4 bg-dark border border-1 border-secondary rounded">
      <form onSubmit={handleSubmit}>
        <Row className="mb-3 border-bottom border-secondary ">
          {/* first name */}
          <Col className="mb-3 ">
            <label htmlFor="firstName" className=" col-form-label">
              First Name
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                style={inputStyle}
                className="form-control"
                id="firstName"
                value={user.firstName}
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
                style={inputStyle}
                className="form-control"
                id="lastName"
                value={user.lastName}
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
                style={inputStyle}
                className="form-control "
                id="email"
                value={user.email}
                onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </Col>
        </Row>
        {isEditing && (
          <Row className="py-3 mt-3 gap-3   border-bottom border-secondary  ">
            <Col md={6}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                style={inputStyle}
                className="form-control mt-1 w-75"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                style={inputStyle}
                className="form-control mt-1 w-75"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Col>
          </Row>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="py-3 mx-3 ">
          {isEditing ? (
            <>
              <MyButton type="button" bgColor="red" onClick={() => setIsEditing(false)}>
                Cancel
              </MyButton>
              <MyButton className="ms-3" bgColor={THEME.orange} isLoading={loading} type="submit">
                Save Changes
              </MyButton>
            </>
          ) : (
            <MyButton type="button" onClick={() => setIsEditing(true)} bgColor={THEME.orange}>
              Edit Profile
            </MyButton>
          )}
        </div>
      </form>
    </Container>
  );
}
