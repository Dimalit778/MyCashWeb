import React from "react";
import monthView from "assets/pagesPhoto/monthView.png";

import editView from "assets/pagesPhoto/editView.png";
import groupImg from "assets/welcomeImages/group.jpg";
import "./about.css";
import { Col, Container, Row } from "react-bootstrap";
const About = () => {
  return (
    <>
      <Container fluid>
        {/* About section one */}
        <Row className=" d-flex p-5  ">
          {/* Image Col */}
          <Col md={6}>
            <img src={groupImg} className="img-fluid " alt="" />
          </Col>
          {/* Text Col */}
          <Col md={6}>
            <div className="Home_text d-inline-flex flex-column gap-4 mt-3 ">
              <div className="d-flex justify-content-center ">
                <h3 className="text-white-50">About Us</h3>
              </div>
              <p>
                CashFlow is a financial planning firm based in Jerusalem, providing comprehensive financial planning
                services to individuals and businesses. Our team of experts is dedicated to helping our clients achieve
                their financial goals by providing them with personalized and customized solutions.
              </p>
              <p>
                We understand that every client has unique financial needs and goals, and we work closely with them to
                develop a plan that is tailored to their specific needs. Our goal is to provide our clients with the
                knowledge and tools they need to make informed financial decisions and achieve financial success.
              </p>
            </div>
          </Col>
        </Row>
        {/* ---- About section two ---- */}
        <Row className="middle_section d-flex p-3   ">
          <div style={{ backgroundColor: "powderblue" }} className="monthView col-md-6 text-center   ">
            <h3>View You're monthly transactions</h3>
            <img src={monthView} alt="monthView" className="aboutImages" />
          </div>

          <div className="editView col-md-6  text-center ">
            <h3 className="text-white-50">You can Add , Edit and Delete transaction</h3>
            <img src={editView} alt="editView" className="aboutImages" />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default About;
