import React from "react";
import { toast } from "react-hot-toast";

import SignUpForm from "components/auth/SignUpForm";
import { useSignUpMutation } from "services/api/authApi";

const SignUp = () => {
  const [signUp, { isLoading }] = useSignUpMutation();

  const handleSignUp = async (formData) => {
    try {
      const res = await signUp(formData).unwrap();
      if (!res) {
        toast.error("Registration failed");
        return;
      }

      toast.success("Registration successful!");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSignUp = () => {
    toast.error("Google Sign-Up not implemented yet");
  };

  return <SignUpForm onSubmit={handleSignUp} onGoogleClick={handleGoogleSignUp} isLoading={isLoading} />;
};

export default SignUp;
