import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import BrandLogo from "components/brandLogo";
import avatarIcon from "assets/icons/avatarIcon.svg";
import logoutIcon from "assets/icons/logoutIcon.svg";
import { currentUser } from "services/reducers/userSlice";
import { useLogoutMutation } from "services/api/authApi";

const TopBar = ({ className }) => {
  const user = useSelector(currentUser);

  const [logout] = useLogoutMutation();
  const location = useLocation();
  const logoutHandler = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Navbar
      data-cy="topBar"
      expand="lg"
      className={`${className}  `}
      style={{
        background: `linear-gradient(to top, #434343, #000000)`,
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        width: "100%",
        height: "65px",
        zIndex: 999,
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <Navbar.Brand data-cy="landing-link" as={Link} to="/">
        <BrandLogo className="me-2" />
      </Navbar.Brand>
      <Nav className="ms-auto">
        {!user ? (
          <div className="d-flex justify-content-center gap-2">
            <Nav.Link
              as={Link}
              to="/signup"
              className={`btn-outline-light ${location.pathname === "/signup"}`}
              data-cy="signup-link"
            >
              Sign Up
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/login"
              className={`btn-outline-light ${location.pathname === "/login"}`}
              data-cy="login-link"
            >
              Login
            </Nav.Link>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <div className="me-4">
              <Button variant="link" className="text-light p-0" onClick={logoutHandler}>
                <img data-cy="nav-profile-icon" src={logoutIcon} alt="logout" width="24" height="24" />
              </Button>
            </div>
            <div className="text-light">
              <img
                src={user?.avatar ? user.avatar : avatarIcon}
                alt="profile"
                width={34}
                height={34}
                style={{ color: "gray" }}
              />
            </div>
          </div>
        )}
      </Nav>
    </Navbar>
  );
};

export default TopBar;
