import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import avatarIcon from "assets/avatar.jpg"; // Adjust the path as needed
import { sidebarLinks } from "constants"; // Adjust the path as needed
import BrandLogo from "components/BrandLogo";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "api/slicesApi/userApiSlice";
import { logout } from "api/slicesApi/authSlice";

const LeftSideBar = ({ className }) => {
  const { pathname } = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className={`d-flex flex-column bg-dark p-2  ${className}`} style={{ height: "100vh" }}>
      <div className="mb-3">
        <BrandLogo />
      </div>

      <Link to={`/profile/${userInfo.id}`} className="flex mb-2 text-center text-light text-decoration-none">
        <img src={avatarIcon} alt="profile" className="rounded-circle me-2" width={80} height={80} />
        <div>
          <p className="mb-0">{userInfo.name}</p>
          <small className="text-muted">@{userInfo.email}</small>
        </div>
      </Link>

      <ul className="nav flex-column p-0 gap-2 ">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li key={link.label}>
              <NavLink to={link.route} className={`nav-link  p-2 ${isActive && "bg-primary  rounded"}`}>
                <img src={link.imgURL} alt={link.label} width={30} height={30} />
                <span className="fs-6 fw-normal ms-3 text-light">{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <Button variant="primary" className="mt-auto w-100" onClick={logoutHandler}>
        Logout
      </Button>
    </nav>
  );
};

export default LeftSideBar;
