import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDeleteUserMutation } from "api/slicesApi/userApiSlice.js";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "config/authSlice";
import useAuth from "hooks/useAuth";
import EditProfile from "components/settings/EditProfile";
import UploadImage from "components/settings/UploadImage";
import EditCategories from "components/settings/EditCategories";

const Settings = () => {
  const user = useSelector(selectCurrentUser);
  // const { logout } = useAuth();
  // const [deleteUser] = useDeleteUserMutation();
  // const navigate = useNavigate();

  // const deleteAlert = () => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "All your data will be deleted",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Delete Account",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       handleDelete();
  //     }
  //   });
  // };

  // const handleDelete = async () => {
  //   try {
  //     await deleteUser();
  //     await logout();
  //     Swal.fire({
  //       title: "Deleted!",
  //       text: "Your Account has been deleted.",
  //       icon: "success",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     setTimeout(() => {
  //       navigate("/login");
  //     }, 2000);
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };

  return (
    <Container fluid className="d-flex flex-column py-3 gap-5 ">
      <UploadImage />
      <EditProfile userInfo={user} />
      <EditCategories userInfo={user} />
    </Container>
  );
};

export default Settings;
