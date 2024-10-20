import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "./authStyle.css";
import Loader from "components/loader/Loader";

const LoginForm = ({ loginUser, signGoogleClick, isLoading, setUserData, userData }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">LOGIN</h1>
        <form className="auth-form" onSubmit={loginUser}>
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
              autoComplete="on"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
            <span className="password-toggle">
              <i className="fas fa-eye"></i>
            </span>
          </div>
          {isLoading && <Loader />}
          <div className="d-grid gap-2">
            <button type="submit" className="btn-submit btn-block">
              Login
            </button>
            <button onClick={signGoogleClick} className="btn btn-outline-light btn-block">
              <FontAwesomeIcon icon={faGoogle} className="me-2" />
              Sign in with Google
            </button>
          </div>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
          <div className="auth-prompt">
            <p>Don't have an account?</p>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
