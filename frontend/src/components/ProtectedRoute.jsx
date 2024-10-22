import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { isAuthenticated } from "store/authSlice";

const ProtectedRoute = () => {
  const auth = useSelector(isAuthenticated);
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
