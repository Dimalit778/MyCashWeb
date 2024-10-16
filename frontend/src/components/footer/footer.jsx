import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="py-2 mt-5" style={{ background: `linear-gradient(to bottom, #434343, #000000)` }}>
      <Container>
        <Row className="text-center text-light mb-1">
          <Col md={6} className="mb-3 mb-md-0">
            <h5 className="mb-3">Contact Information</h5>
            <p className="mb-1">Israel, Tel Aviv</p>
            <p className="mb-1">Email: Dimapt778@gmail.com</p>
            <p>Phone: +925 526731280</p>
          </Col>
          <Col md={6} className="d-flex flex-column  ">
            <h5 className="">Follow Us</h5>
            <div className="my-auto d-flex justify-content-center align-items-center gap-4">
              <a
                href="https://www.facebook.com/dima.litvinov1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                href="https://www.instagram.com/dima1litvinov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-light">
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="bg-secondary my-2" />
        <Row>
          <Col className="text-center text-light">
            <p className="mb-0">&copy; {new Date().getFullYear()} MyCash - All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
