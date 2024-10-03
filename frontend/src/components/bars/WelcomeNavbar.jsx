import React from "react";
import "./bars.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "api/slicesApi/userApiSlice";
import { logout } from "api/slicesApi/authSlice";
import BrandLogo from "components/BrandLogo";

const WelcomeNavBar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar expand="lg" className="home_navbar sticky-top py-2">
        <title>MyCash</title>
        <Navbar.Brand>
          <BrandLogo />
        </Navbar.Brand>
        <Navbar.Toggle className=" me-4 " aria-controls="basic-navbar-nav " />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Links ---> Home , About us */}
          <Nav className=" mx-auto gap-3">
            <Nav.Link as={Link} to="/" className="navLinks mx-auto  ">
              <h5>Home</h5>
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="navLinks mx-auto ">
              <h5>About Us</h5>
            </Nav.Link>
          </Nav>
          {/* Link ---> User Profile */}
          <Nav className="pt-1 d-flex  ">
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
              // {/* --- > USERNAME AND LINK TO PROFILE < --- */}
              <div className="userName pe-3">
                <NavDropdown title={userInfo.name} id="username" className="userProfile mx-auto p-1 text-center ">
                  <NavDropdown.Item onClick={() => navigate("/")}>Profile</NavDropdown.Item>

                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default WelcomeNavBar;
