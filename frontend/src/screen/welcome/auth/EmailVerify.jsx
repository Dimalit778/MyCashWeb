import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useVerifyEmailMutation } from "api/slicesApi/userApiSlice.js";
import { useParams } from "react-router-dom";

import { setCredentials } from "api/slicesApi/authSlice";
import Loader from "components/Loader";

const EmailVerify = () => {
  const [verifyEmail] = useVerifyEmailMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emailToken } = useParams();

  useEffect(() => {
    (async () => {
      if (emailToken) {
        try {
          const res = await verifyEmail(emailToken).unwrap();

          dispatch(setCredentials({ ...res }));
          Swal.fire({
            title: `Hello ${res.name}`,
            text: "Email Successfully Verified",
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
          });

          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [emailToken, navigate, dispatch, verifyEmail]);

  return <div className="verifyEmail d-flex vh-100 justify-content-center align-items-center  ">{<Loader />}</div>;
};

export default EmailVerify;
