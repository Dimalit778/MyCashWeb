import React from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import "@sweetalert2/theme-dark/dark.css";
import { useLogoutMutation } from "services/api/authApi";
import { useDeleteUserMutation } from "services/api/userApi";
export default function DeleteUser() {
  const [logout] = useLogoutMutation();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  const deleteAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All your data will be deleted",
      icon: "warning",
      showCancelButton: true,

      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete Account",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      await logout();
      Swal.fire({
        title: "Deleted!",
        text: "Your Account has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="text-center mt-5">
      <button className="btn btn-danger" onClick={deleteAlert}>
        Delete Account
      </button>
    </div>
  );
}
