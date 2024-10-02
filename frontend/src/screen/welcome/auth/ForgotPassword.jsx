import { useForgotPasswordMutation } from "api/slicesApi/userApiSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.isVerify) {
      navigate("dashboard");
    }
  }, [navigate, userInfo]);

  const sendMail = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      Swal.fire({
        title: "Link sent successfully",
        text: "Click on the link in your email to Reset Password",
        icon: "success",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <div className="wrapper d-flex align-items-center justify-content-center w-100      ">
        <div className="login ">
          <h3 className=" text-center mt-auto  ">Enter Your Email</h3>

          <form className="signInForm d-grid gap-4 p-2" onSubmit={sendMail}>
            {/* ---> Email input <--- */}
            <div className="form-group ">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className=" form-control"
                placeholder="Email"
              />
            </div>

            <div className="formSubmit">
              <button type="submit" className="form-control btn btn-outline-dark submit px-3">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
