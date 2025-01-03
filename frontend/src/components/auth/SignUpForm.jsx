import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./authStyle.css";
import IconButton from "components/ui/icon";
import TextInput from "components/ui/textInput";
import MyButton from "components/ui/button";
import { THEME } from "constants/Theme";

const SignUpForm = ({ onSubmit, onGoogleClick, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = watch("password");

  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
    validate: {
      notAdmin: (value) => {
        return !value.toLowerCase().includes("admin") || 'Email cannot contain word "admin"';
      },
      notTest: (value) => {
        return !value.toLowerCase().includes("test") || 'Email cannot contain word "test"';
      },
      validDomain: (value) => {
        const domain = value.split("@")[1];
        const validDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
        return validDomains.includes(domain) || "Please use a valid email ";
      },
    },
  };

  return (
    <div className="auth-container ">
      <div className="auth-form-wrapper">
        <h1 data-cy="signup-title" className="auth-title">
          SIGN UP
        </h1>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex gap-3">
            <TextInput
              data-cy="signup-firstName"
              name="firstName"
              control={control}
              placeholder="First Name"
              className="form-control"
              rules={{
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
              }}
            />
            <TextInput
              data-cy="signup-lastName"
              name="lastName"
              control={control}
              placeholder="Last Name"
              className="form-control"
              rules={{
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
              }}
            />
          </div>

          <TextInput
            data-cy="signup-email"
            name="email"
            control={control}
            type="email"
            placeholder="Email"
            className="form-control"
            rules={emailValidation}
          />

          <TextInput
            data-cy="signup-password"
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

          <TextInput
            data-cy="signup-confirm-password"
            name="confirmPassword"
            control={control}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="form-control"
            autoComplete="none"
            rules={{
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            }}
            endAdornment={
              <IconButton
                icon={<FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                color="white"
                border="none"
              />
            }
          />

          <div className="d-grid gap-2">
            <MyButton data-cy="signup-submit" type="submit" bgColor={THEME.orange} isLoading={isLoading}>
              Sign Up
            </MyButton>
            <button
              data-cy="signup-google"
              type="button"
              onClick={onGoogleClick}
              className="btn btn-outline-light btn-block"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faGoogle} className="me-2" />
              Sign up with Google
            </button>
          </div>

          <div className="auth-prompt">
            <p>Already have an account?</p>
            <Link data-cy="goto-login" to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
