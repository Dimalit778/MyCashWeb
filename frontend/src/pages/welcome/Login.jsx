import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGoogleAuthMutation, useLoginMutation } from "api/slicesApi/userApiSlice";

import { GoogleAuth } from "api/fireBase/Firebase";
import LoginForm from "components/auth/LoginForm";

const Login = () => {
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

  const handleLogin = async (formData) => {
    try {
      const res = await login(formData).unwrap();
      if (!res) return toast.error(res.error);

      navigate("/main");
    } catch (err) {
      toast.error(err.data?.message || err.error);
    }
  };

  return <LoginForm onSubmit={handleLogin} onGoogleClick={signGoogleClick} isLoading={isLoading} />;
};

export default Login;
