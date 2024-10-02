import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "api/slicesApi/userApiSlice";
import { logout } from "api/slicesApi/authSlice";
import "./bars.css";
import BrandLogo from "components/BrandLogo";
import avatarIcon from "assets/icons/avatarIcon.svg";
import logoutIcon from "assets/icons/logoutIcon.svg";

const TopBar = ({ className }) => {
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
    <Navbar bg="dark" variant="dark" expand="lg" className={`${className} p-2`}>
      <Container fluid>
        <Navbar.Brand>
          <BrandLogo />
        </Navbar.Brand>
        <div className="ms-auto">
          {!userInfo ? (
            <>
              {/* --- > LOGIN AND REGISTER BUTTONS < --- */}
              <div className=" d-flex gap-3 pe-3 justify-content-center mx-auto     ">
                <button className="logRegBtn">
                  <Nav.Link as={Link} to="/register" className="">
                    SIGN UP
                  </Nav.Link>
                </button>
                <button className="logRegBtn">
                  <Nav.Link as={Link} to="/login" className="">
                    LOGIN
                  </Nav.Link>
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center">
              <div className="me-4">
                <Button variant="link" className="text-light p-0" onClick={() => console.log("logout")}>
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
        </div>
      </Container>
    </Navbar>
  );
};

export default TopBar;
