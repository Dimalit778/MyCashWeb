import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/authStyle.css";
import TextInput from "components/textInput";
import IconButton from "components/icon";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import MyButton from "components/button";
import { THEME } from "constants/Theme";

const LoginForm = ({ onSubmit, signGoogleClick, isLoading }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">LOGIN</h1>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="email"
            control={control}
            type="email"
            placeholder="Email"
            className="form-control"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />

          <TextInput
            name="password"
            control={control}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="form-control"
            autoComplete="none"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            endAdornment={
              <IconButton
                icon={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
                onClick={() => setShowPassword(!showPassword)}
                color="white"
                border="none"
              />
            }
          />

          <div className="d-grid gap-2">
            <MyButton type="submit" bgColor={THEME.orange} isLoading={isLoading}>
              Login
            </MyButton>
            <MyButton type="button" onClick={signGoogleClick} className="btn btn-outline-light btn-block">
              <FontAwesomeIcon icon={faGoogle} className="me-2" />
              Sign in with Google
            </MyButton>
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
