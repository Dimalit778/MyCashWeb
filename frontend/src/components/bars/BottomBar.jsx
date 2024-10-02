import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "constants";

const BottomBar = ({ className }) => {
  const { pathname } = useLocation();

  return (
    <Nav className={`${className} fixed-bottom bg-dark justify-content-around py-2`}>
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Nav.Item key={`bottombar-${link.label}`}>
            <Nav.Link
              as={Link}
              to={link.route}
              className={`d-flex flex-column align-items-center ${isActive ? "text-primary" : "text-light"}`}
            >
              <img src={link.imgURL} alt={link.label} width={24} height={24} />
              <span className="small">{link.label}</span>
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

export default BottomBar;
