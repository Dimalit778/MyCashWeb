import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import TextInput from "components/ui/textInput";
import IconButton from "components/ui/icon";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import MyButton from "components/ui/button";
import { THEME } from "constants/Theme";
import "./authStyle.css";
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
        <h1 data-cy="login-title" className="auth-title">
          LOGIN
        </h1>
        <form className="auth-form " onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-column gap-3 mb-3 ">
            <TextInput
              data-cy="login-email"
              name="email"
              control={control}
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
              data-cy="login-password"
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
          </div>
          <div className="d-grid gap-2">
            <MyButton data-cy="login-submit" type="submit" bgColor={THEME.orange} isLoading={isLoading}>
              Login
            </MyButton>
            <MyButton
              data-cy="login-google"
              type="button"
              onClick={signGoogleClick}
              className="btn btn-outline-light btn-block"
            >
              <FontAwesomeIcon icon={faGoogle} className="me-2" />
              Sign in with Google
            </MyButton>
          </div>

          <Link data-cy="forgot-password" to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>

          <div className="auth-prompt">
            <p>Don't have an account?</p>
            <button
              data-cy="goto-signup"
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
