import TopBar from "components/layout/topBar/TopBar";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { currentUser } from "services/store/userSlice";

const PublicLayout = () => {
  const user = useSelector(currentUser);

  if (user) {
    return <Navigate to="/main" replace />;
  }
  return (
    <div className="bg-black min-vh-100">
      <TopBar className="sticky-top" />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
export default PublicLayout;
