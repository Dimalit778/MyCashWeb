import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import "./authStyle.css";
import Loader from "components/loader/Loader";
const SignUpForm = ({ signUpUser, signGoogleClick, isLoading, setUserData, userData }) => {
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">SIGN UP</h1>
        <form className="auth-form" onSubmit={signUpUser}>
          <div className="form-group">
            <input
              required
              type="text"
              className="form-control"
              placeholder="Full Name"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              required
              type="email"
              className="form-control"
              placeholder="Email"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              required
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              required
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
            />
          </div>
          {isLoading && <Loader />}
          <div className="d-grid gap-2">
            <button type="submit" className="btn-submit">
              Sign Up
            </button>
            <button onClick={signGoogleClick} className="btn btn-outline-light btn-block">
              <FontAwesomeIcon icon={faGoogle} className="me-2" />
              Sign up with Google
            </button>
          </div>
          <div className="auth-prompt">
            <p>Already have an account?</p>
            <Link to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
