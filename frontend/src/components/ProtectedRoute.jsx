import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { currentUser } from "store/authSlice";

const ProtectedRoute = () => {
  const user = useSelector(currentUser);
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
