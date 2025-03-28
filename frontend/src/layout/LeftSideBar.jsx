import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import avatarIcon from "assets/avatar.jpg";
import BrandLogo from "components/brandLogo";
import { useSelector } from "react-redux";
import MyButton from "components/ui/button";
import { currentUser } from "services/reducers/userSlice";
import { HOME_LINKS } from "constants/HomeLinks";
import { THEME } from "constants/Theme";
import { useLogoutMutation } from "services/api/authApi";
import CloudImage from "components/ui/cloudImage";

const LeftSideBar = () => {
  const { pathname } = useLocation();
  const user = useSelector(currentUser);
  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      data-cy="left-sidebar"
      className="d-flex flex-column p-2 "
      style={{ height: "100vh", backgroundColor: "black" }}
    >
      <div data-cy="brand-logo" className="mb-3">
        <BrandLogo />
      </div>

      <div
        data-cy="profile-image-container"
        className="d-flex flex-column align-items-center justify-content-center text-center p-2"
      >
        {user?.imageUrl ? (
          <div
            data-cy="user-profile-image"
            style={{ width: "100px", height: "100px", overflow: "hidden" }}
            className="rounded-circle"
          >
            <CloudImage
              publicId={user.imageUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              alt="profile"
            />
          </div>
        ) : (
          <img
            data-cy="avatar-icon"
            src={avatarIcon}
            alt="profile"
            className="rounded-circle me-2"
            width={80}
            height={80}
          />
        )}

        <div className="mt-2">
          <h3 data-cy="user-name" className="mb-0">
            {user.firstName + " " + user.lastName}
          </h3>
          <small data-cy="user-email">{user.email}</small>
        </div>
      </div>

      <hr style={{ backgroundColor: "gray", height: "3px" }} />
      <ul className="nav flex-column p-0 gap-2 mt-1 ps-2 ">
        {HOME_LINKS.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li key={link.label}>
              <NavLink
                data-cy={`nav-${link.dataCy}`}
                to={link.route}
                className="nav-link p-2 rounded"
                style={{ backgroundColor: isActive ? THEME.orange : "transparent" }}
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
      <MyButton
        data-cy="left-sidebar-logout-button"
        bgColor={THEME.dark}
        className="mt-auto w-auto"
        onClick={logoutHandler}
      >
        Logout
      </MyButton>
    </div>
  );
};

export default LeftSideBar;
