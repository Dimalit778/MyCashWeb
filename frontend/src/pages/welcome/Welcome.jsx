import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import groupImg from "assets/welcomeImages/group.jpg";

import WelcomeAnimation from "components/custom/WelcomeAnimation";
import Footer from "components/footer/footer";

const Welcome = () => {
  const headerText = {
    textTransform: "uppercase",
    fontSize: "4.5rem",
    letterSpacing: "0.2rem",
    fontWeight: "bold",
    color: "white",
  };

  const strokeText = {
    textTransform: "uppercase",
    fontSize: "4.5rem",
    letterSpacing: "0.5rem",
    fontWeight: "bold",
    textOverflow: "inherit",
    color: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    WebkitTextStrokeWidth: "1px",
    WebkitTextStrokeColor: "white",
  };
  return (
    <>
      <Container fluid className="">
        <Row className="mt-3 pb-5 g-3 text-center  ">
          <span style={headerText}>Manage Your </span>
          <span style={strokeText}>Money</span>
          <WelcomeAnimation />
        </Row>

        <Row className="d-flex mt-5 ">
          <Col sm={6}>
            <img src={groupImg} className="img-fluid " alt="" />
          </Col>
          <Col sm={6}>
            <div className="Home_text d-inline-flex flex-column gap-4 mt-3 ">
              <div className=" d-flex justify-content-center ">
                <h3>About Us</h3>
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
      </Container>
      <Footer />
    </>
  );
};

export default Welcome;
