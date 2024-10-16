import React, { useState } from "react";

// import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useSignUpMutation } from "../../api/slicesApi/userApiSlice";

import { validEmail } from "hooks/validedForm";
import { useDispatch } from "react-redux";
import { setCredentials } from "config/authSlice";

import SignUpForm from "components/auth/SignUpForm";

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();

  const [signUp, { isLoading }] = useSignUpMutation();

  const signUpUser = async (e) => {
    const { name, email, password } = userData;
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

  const signGoogleClick = () => {
    // Implement Google Sign-Up logic here
    console.log("Google Sign-Up clicked");
  };

  return (
    <SignUpForm
      signUpUser={signUpUser}
      signGoogleClick={signGoogleClick}
      isLoading={isLoading}
      setUserData={setUserData}
      userData={userData}
    />
  );
};

export default SignUp;
