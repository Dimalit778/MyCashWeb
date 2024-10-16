import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGoogleAuthMutation, useLoginMutation } from "api/slicesApi/userApiSlice";

import { GoogleAuth } from "api/fireBase/Firebase";
import LoginForm from "components/auth/LoginForm";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();

  const signGoogleClick = async (e) => {
    e.preventDefault();
    const user = await GoogleAuth();

    if (user) {
      try {
        await googleAuth(user).unwrap();

        navigate("/main");
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = userData;
    if (!email) {
      return toast.error("Email Address Not Valid");
    }
    if (!password) return toast.error("Enter Password");
    try {
      const res = await login({ email, password }).unwrap();
      if (!res) return toast.error(res.error);

      navigate("/main");
    } catch (err) {
      toast.error(err.data?.message || err.error);
    }
  };

  return (
    <LoginForm
      loginUser={loginUser}
      signGoogleClick={signGoogleClick}
      isLoading={isLoading}
      setUserData={setUserData}
      userData={userData}
    />
  );
};

export default Login;
