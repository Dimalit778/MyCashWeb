import TopBar from "layout/TopBar";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { currentUser } from "services/reducers/userSlice";

const PublicLayout = () => {
  const user = useSelector(currentUser);

  if (user) {
    return <Navigate to="/home" replace />;
  }
  return (
    <div className="bg-black min-vh-100">
      <TopBar className="sticky-top" />
      <div className="main-content" style={{ paddingTop: "65px" }}>
        <Outlet />
      </div>
    </div>
  );
};
export default PublicLayout;
