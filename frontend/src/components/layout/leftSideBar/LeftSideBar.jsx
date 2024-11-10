import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import avatarIcon from "assets/avatar.jpg"; // Adjust the path as needed

import BrandLogo from "components/ui/BrandLogo";
import { useSelector } from "react-redux";
import { Theme, appLinks } from "utils/constants";
import MyButton from "components/ui/MyButton";
import { currentUser } from "services/store/userSlice";
import { useLogoutMutation } from "api/slicesApi/userApiSlice";

const LeftSideBar = () => {
  const { pathname } = useLocation();
  const user = useSelector(currentUser);
  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex flex-column p-2 " style={{ height: "100vh", backgroundColor: "black" }}>
      <div className="mb-3">
        <BrandLogo />
      </div>

      <div className="flex p-2 text-center text-light text-decoration-none">
        <img
          data-testid="nav-profile-icon"
          src={avatarIcon}
          alt="profile"
          className="rounded-circle me-2"
          width={80}
          height={80}
        />
        <div className="mt-2">
          <h3 className="mb-0">{user.firstName + " " + user.lastName}</h3>
          <small className="">{user.email}</small>
        </div>
      </div>

      <hr style={{ backgroundColor: "gray", height: "3px" }} />
      <ul className="nav flex-column p-0 gap-2 mt-1 ps-2 ">
        {appLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li key={link.label}>
              <NavLink
                to={link.route}
                className="nav-link p-2 rounded"
                style={{ backgroundColor: isActive ? Theme.orange : "transparent" }}
              >
                <img src={link.imgURL} alt={link.label} width={28} height={28} />
                <span
                  className="ms-3 text-light "
                  style={{ fontFamily: "Oswald", fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "1px" }}
                >
                  {link.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
      <MyButton bgColor={Theme.dark} className="mt-auto w-auto" onClick={logoutHandler}>
        Logout
      </MyButton>
    </div>
  );
};

export default LeftSideBar;
