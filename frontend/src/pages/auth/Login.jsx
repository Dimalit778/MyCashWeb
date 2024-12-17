import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import LoginForm from "components/auth/LoginForm";
import { firebaseOAuth } from "hooks/firebaseOAuth";
import { useGoogleAuthMutation, useLoginMutation } from "services/api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();

  const signGoogleClick = async (e) => {
    e.preventDefault();
    const user = await firebaseOAuth();

    if (user) {
      try {
        await googleAuth(user).unwrap();

        navigate("/home");
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleLogin = async (formData) => {
    try {
      await login(formData).unwrap();

      navigate("/home");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return <LoginForm onSubmit={handleLogin} onGoogleClick={signGoogleClick} isLoading={isLoading} />;
};

export default Login;
