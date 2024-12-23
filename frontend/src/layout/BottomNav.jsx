import { HOME_LINKS } from "constants/HomeLinks";
import { THEME } from "constants/Theme";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const BottomNav = ({ className }) => {
  const { pathname } = useLocation();

  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Nav
      data-cy="bottom-nav"
      className={`${className} d-flex flex-nowrap border-top   `}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "black",
        height: "50px",
        zIndex: 999,
        width: "100%",
        boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.5)",
      }}
    >
      {HOME_LINKS.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Nav.Item key={`bottomNav-${link.label}`} className="flex-grow-1 text-center">
            <Nav.Link
              as={Link}
              to={link.route}
              className="d-flex flex-column align-items-center"
              style={{ backgroundColor: isActive ? THEME.orange : "transparent" }}
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

export default BottomNav;
