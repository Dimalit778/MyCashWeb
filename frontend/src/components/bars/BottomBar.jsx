import { sidebarLinks } from "constants";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const BottomBar = ({ className }) => {
  const { pathname } = useLocation();

  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Nav className={`${className} fixed-bottom d-flex flex-nowrap border-top   `}>
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Nav.Item key={`bottombar-${link.label}`} className="flex-grow-1 text-center">
            <Nav.Link
              as={Link}
              to={link.route}
              className={`d-flex flex-column align-items-center ${isActive && "bg-primary"}`}
              onClick={handleNavClick}
            >
              <img src={link.imgURL} alt={link.label} width={30} height={30} className="mb-1" />
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

export default BottomBar;
