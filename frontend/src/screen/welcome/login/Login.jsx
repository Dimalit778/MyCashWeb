import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useGoogleAuthMutation, useLoginMutation } from "api/slicesApi/userApiSlice";
import { setCredentials } from "api/slicesApi/authSlice";
import Loader from "components/Loader";
import { Form } from "react-bootstrap";

import { GoogleAuth } from "api/fireBase/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();

  //@  Google Auth -->
  const signGoogleClick = async (e) => {
    e.preventDefault();
    const user = await GoogleAuth();

    if (user) {
      try {
        const res = await googleAuth(user).unwrap();

        dispatch(setCredentials({ ...res }));
        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  //@ Login with Email and Password
  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = userData;
    if (!email) {
      return toast.error("Email Address Not Valid");
    }
    if (!password) return toast.error("Enter Password");
    try {
      const res = await login({ email, password }).unwrap();

      if (!res) {
        toast.error(res.error);
        return;
      }
      dispatch(setCredentials({ ...res }));
    } catch (err) {
      toast.error(err.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="wrapper d-flex align-items-center justify-content-center w-100      ">
        <div className="login ">
          <h3 className=" text-center mt-auto ">Log In Here</h3>
          <form className="signInForm d-grid gap-4 p-2" onSubmit={loginUser}>
            {/* ---> EMAIL INPUT <--- */}
            <Form.Group className="form-group" controlId="name">
              <Form.Control
                type="name"
                placeholder="Enter Email"
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              ></Form.Control>
            </Form.Group>
            {/* ---> PASSWORD INPUT <--- */}
            <Form.Group className="form-group" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                required
                autoComplete="on"
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              ></Form.Control>
              <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"></span>
            </Form.Group>
            {/* ---> LOADER <--- */}
            {isLoading && <Loader />}
            {/* ---> LOGIN SUBMIT BUTTON <--- */}
            <div className="formSubmit">
              <button type="submit" className="form-control bn31 ">
                <span className="bn31span">Login</span>
              </button>
            </div>
            {/* ---> GOOGLE LOG IN <--- */}
            <button onClick={signGoogleClick} className="form-control bn9  ">
              <span className="">
                <FontAwesomeIcon icon={faGoogle} size="lg" className=" pe-3" />
                Sign with Google
              </span>
            </button>
            {/* ---> RESET PASSWORD <--- */}
            <Link className="text d-flex justify-content-center text-decoration-none  " to="/forgot-password">
              Forgot password?
            </Link>
            {/* ---> Div navigate to Register Page  <--- */}
            <div className="d-flex align-items-center justify-content-center gap-3">
              <p className=" text-dark mb-0 ">Don't have an account?</p>
              <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => navigate("/register")}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
