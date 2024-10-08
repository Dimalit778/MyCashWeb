import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import avatarIcon from "assets/avatar.jpg"; // Adjust the path as needed
import { sidebarLinks } from "constants"; // Adjust the path as needed
import BrandLogo from "components/BrandLogo";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "api/slicesApi/userApiSlice";
import { logout } from "api/slicesApi/authSlice";
import { Theme } from "constants/colors";
import MyButton from "components/MyButton";

const LeftSideBar = ({ className }) => {
  const { pathname } = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const name = "dima";
  const email = "dima@gmail.com";
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
    <Nav className={`d-flex flex-column  p-2  ${className}`} style={{ height: "100vh" }}>
      <div className="mb-3">
        <BrandLogo />
      </div>

      <Link to={`/profile/${userInfo.id}`} className="flex p-2 text-center text-light text-decoration-none">
        <img src={avatarIcon} alt="profile" className="rounded-circle me-2" width={80} height={80} />
        <div className="mt-2">
          <p className="mb-0">{name}</p>
          <small className="">@{email}</small>
        </div>
      </Link>

      <ul className="nav flex-column p-0 gap-2 mt-1 ">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li key={link.label}>
              <NavLink
                to={link.route}
                className="nav-link  p-2 rounded"
                style={{ backgroundColor: isActive ? Theme.orange : "transparent" }}
              >
                <img src={link.imgURL} alt={link.label} width={28} height={28} />
                <span className="fs-6 fw-normal ms-3 text-light">{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
      <MyButton bgColor={"transparent"} className="mt-auto w-auto" onClick={logoutHandler}>
        Logout
      </MyButton>
    </Nav>
  );
};

export default LeftSideBar;
