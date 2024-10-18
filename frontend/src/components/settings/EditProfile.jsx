import MyButton from "components/custom/MyButton";
import { Theme } from "constants/colors";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

export default function EditProfile({ userInfo }) {
  const [user, setUser] = useState(userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    console.log("handleSubmit");
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
    <Container fluid className="p-4 border border-1 border-secondary rounded">
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
          <Row className="py-3 mt-3 gap-3   border-bottom border-secondary  ">
            <Col md={6}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                className="form-control mt-1 bg-secondary text-light border-dark w-75"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control mt-1 bg-secondary text-light border-dark w-75"
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
              <MyButton className="ms-3" bgColor={Theme.orange} isLoading={loading} type="submit">
                Save Changes
              </MyButton>
            </>
          ) : (
            <MyButton type="button" onClick={() => setIsEditing(true)} bgColor={Theme.orange}>
              Edit Profile
            </MyButton>
          )}
        </div>
      </form>
    </Container>
  );
}
