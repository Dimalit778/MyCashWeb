import React from "react";
import "./home.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import groupImg from "assets/welcomeImages/group.jpg";
import iconImage1 from "assets/welcomeImages/iconImage1.png";
import { useNavigate } from "react-router-dom";

import WelcomeAnimation from "components/WelcomeAnimation";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container fluid>
        {/* ----> SECTION 1 <----  */}
        <Row className="home_section1  ">
          <Row className="d-flex">
            {/* ----> Header div <---- */}
            <Col sm={8} className="d-flex flex-column justify-content-around   text-center">
              <span className="section_one_header ">Manage Your </span>
              <span className="stroke-text ">Money</span>
              {/* Button */}
              <WelcomeAnimation />
            </Col>
            {/* ----> Image div <---- */}
            <Col sm={4} className=" d-flex flex-column justify-content-around  ">
              <img className=" m-5" src={iconImage1} alt="iconImage1" />
              <div className="btns d-flex justify-content-center gap-2 ">
                <button onClick={() => navigate("/register")}>Join Us</button>
                <button onClick={() => navigate("/about")}>Learn More</button>
              </div>
            </Col>
          </Row>
        </Row>

        {/* SECTION 2  */}
        <Row className="home_section2 mt-5">
          <div className="row d-flex ">
            <div className="col-12 col-lg-6  ">
              <img src={groupImg} className="img-fluid " alt="" />
            </div>
            <div className="col-12 col-lg-6  ">
              <div className="Home_text d-inline-flex flex-column gap-4 mt-3 ">
                <div className=" d-flex justify-content-center ">
                  <h3>About Us</h3>
                </div>
                <p>
                  CashFlow is a financial planning firm based in Jerusalem, providing comprehensive financial planning
                  services to individuals and businesses. Our team of experts is dedicated to helping our clients
                  achieve their financial goals by providing them with personalized and customized solutions.
                </p>
                <p>
                  We understand that every client has unique financial needs and goals, and we work closely with them to
                  develop a plan that is tailored to their specific needs. Our goal is to provide our clients with the
                  knowledge and tools they need to make informed financial decisions and achieve financial success.
                </p>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Home;
