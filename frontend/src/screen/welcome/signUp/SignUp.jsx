import React, { useEffect, useState } from "react";
import "./signUp.css";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useSignUpMutation } from "../../../api/slicesApi/userApiSlice";

import { Form } from "react-bootstrap";
import { validEmail } from "hooks/validedForm";
import { useDispatch } from "react-redux";
import { setCredentials } from "api/slicesApi/authSlice";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signUp, { isLoading }] = useSignUpMutation();

  const alert = () => {
    Swal.fire({
      title: "Link sent successfully",
      text: "Click on the link in your email to confirm your account",
      icon: "success",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    if (!validEmail(email)) return toast.error("Email Address Not Valid");

    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      const res = await signUp({ name, email, password }).unwrap();
      if (!res) {
        toast.error(res.error);
        return;
      }
      dispatch(setCredentials({ ...res }));
      // alert();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="wrapper d-flex align-items-center justify-content-center w-100">
        <div className="login ">
          <h3 className="p my-4  text-center">Register Here</h3>

          <Form onSubmit={submitHandler} className="signInForm d-grid gap-4 p-2">
            <Form.Group className="form-group" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* ! ----- EMAIL FORM ------!*/}
            <Form.Group className="form-group" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* ! ----- PASSWORD FORM ------!*/}
            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                autoComplete="on"
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
              <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"></span>
            </Form.Group>
            {isLoading && <Loader />}
            {/* ! ----- SUBMIT ------!*/}
            <div className="formSubmit">
              <button type="submit" className="form-control bn31 ">
                <span className="bn31span">Sign Up</span>
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <p className=" mb-0 ">Already have an account?</p>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
