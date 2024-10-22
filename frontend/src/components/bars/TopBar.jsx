import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import BrandLogo from "components/custom/BrandLogo";
import avatarIcon from "assets/icons/avatarIcon.svg";
import logoutIcon from "assets/icons/logoutIcon.svg";

import { useLogoutMutation } from "api/slicesApi/userApiSlice";

const TopBar = ({ className }) => {
  const { userInfo } = useSelector((state) => state.auth);
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
    <Navbar expand="lg" className={`${className} topBar p-2`} style={{}}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <BrandLogo className="me-2" />
        </Navbar.Brand>
        <Nav className="ms-auto">
          {!userInfo ? (
            <div className="d-flex justify-content-center gap-2">
              <Nav.Link
                as={Link}
                to="/register"
                className={`btn-outline-light ${location.pathname === "/register" ? "active" : ""}`}
              >
                Sign Up
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/login"
                className={`btn-outline-light ${location.pathname === "/login" ? "active" : ""}`}
              >
                Login
              </Nav.Link>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <div className="me-4">
                <Button variant="link" className="text-light p-0" onClick={logoutHandler}>
                  <img src={logoutIcon} alt="logout" width="24" height="24" />
                </Button>
              </div>
              <div className="text-light">
                <img
                  src={userInfo?.avatar ? userInfo.avatar : avatarIcon}
                  alt="profile"
                  width={34}
                  height={34}
                  style={{ color: "gray" }}
                />
              </div>
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopBar;
