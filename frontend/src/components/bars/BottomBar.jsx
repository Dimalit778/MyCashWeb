import { sidebarLinks } from "constants";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const BottomBar = ({ className }) => {
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <Nav className={`${className} fixed-bottom bg-dark d-flex flex-nowrap `}>
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.route;
        console.log("link ", link.route);
        return (
          <Nav.Item key={`bottombar-${link.label}`} className="flex-grow-1 text-center">
            <Nav.Link
              as={Link}
              to={link.route}
              className={`d-flex flex-column align-items-center ${isActive && "bg-primary"}`}
            >
              <img src={link.imgURL} alt={link.label} width={26} height={26} className="m-1" />
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

export default BottomBar;
