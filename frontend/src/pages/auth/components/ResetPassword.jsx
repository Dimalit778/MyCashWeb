import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useResetPasswordMutation, useVerifyLinkMutation } from "api/slicesApi/userApiSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [resetPassword] = useResetPasswordMutation();
  const [verifyLink] = useVerifyLinkMutation();
  const [validUser, setValidUser] = useState(false);

  const { id, token } = useParams();

  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const userValid = async () => {
      try {
        await verifyLink({ id, token }).unwrap();
        Swal.fire({
          title: "Welcome Back",
          text: "Please Enter New Password",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        setValidUser(true);
      } catch (err) {
        toast.error(err.data?.message || err.message);

        setValidUser(false);
      }
    };

    if (userInfo?.isVerify) navigate("dashboard");
    userValid();
  }, [navigate, userInfo, id, token, verifyLink, setValidUser]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ id, token, newPassword }).unwrap();
      toast.success("Password Successfully Changed.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });

      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <div className="wrapper d-flex align-items-center justify-content-center w-100      ">
        <div className="login ">
          {validUser ? (
            <>
              <h3 className=" text-center mt-auto ">Enter New Password</h3>
              <form className="signInForm d-grid gap-4 p-2" onSubmit={submitHandler}>
                {/* ---> Email input <--- */}
                <div className="form-group ">
                  <input
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    className=" form-control"
                    placeholder="*****"
                  />
                </div>

                <div className="formSubmit">
                  <button type="submit" className="form-control btn btn-outline-dark submit px-3">
                    Update Password
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className=" d-flex gap-3 ">
              <h1>Invalid Link</h1>
              <span className=" pt-2">
                <FontAwesomeIcon icon={faCircleExclamation} size="2xl" />
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
