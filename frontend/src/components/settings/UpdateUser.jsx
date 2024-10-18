import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "../../api/slicesApi/userApiSlice";
import { setCredentials } from "../../config/authSlice";
import { toast } from "react-hot-toast";
import Loader from "../custom/Loader";
import { Form } from "react-bootstrap";

export const UpdateUser = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState();
  const [password, setPassword] = useState();

  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    setName(userInfo.name);
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfile({
        name,
        password,
      }).unwrap();
      dispatch(
        setCredentials({
          name: res.name,
          email: res.email,
          imageUrl: res.imageUrl,
          isVerified: res.isVerified,
          isAdmin: res.isAdmin,
        })
      );

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className=" d-flex justify-content-center h-auto text-center     ">
      <Form className="editUser " onSubmit={submitHandler}>
        <h3 className=" text-center">Edit User</h3>
        <Form.Group className=" mb-4" controlId="name">
          <Form.Label className="editLabel d-block">
            <p>Enter Name</p>
          </Form.Label>
          <Form.Control
            className=" text-center "
            type="name"
            placeholder={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label className="editLabel d-block   ">
            <p>Enter Password</p>
          </Form.Label>
          <Form.Control
            className="form-control text-center "
            placeholder="New Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <button type="submit" className="bn3637 bn36 mt-3">
          SAVE
        </button>
      </Form>
    </div>
  );
};
