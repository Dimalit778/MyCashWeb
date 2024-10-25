import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import groupImg from "assets/welcomeImages/group.jpg";
import WelcomeAnimation from "components/custom/WelcomeAnimation";
import Footer from "components/footer/footer";
import "styles/WelcomeStyle.css";

const Welcome = () => {
  return (
    <div className="welcome-wrapper">
      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h1 className="main-title mb-0">MANAGE YOUR</h1>
                <h1 className="stroke-title">MONEY</h1>
                <div className="animation-wrapper">
                  <WelcomeAnimation />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* About Section */}
        <section className="about-section">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <div className="image-container">
                  <img src={groupImg} alt="Team" className="about-image" />
                </div>
              </Col>
              <Col lg={6}>
                <div className="about-content">
                  <h2 className="section-title">About Us</h2>
                  <p className="about-text">
                    CashFlow is a financial planning firm based in Jerusalem, providing comprehensive financial planning
                    services to individuals and businesses. Our team of experts is dedicated to helping our clients
                    achieve their financial goals by providing them with personalized and customized solutions.
                  </p>
                  <p className="about-text">
                    We understand that every client has unique financial needs and goals, and we work closely with them
                    to develop a plan that is tailored to their specific needs. Our goal is to provide our clients with
                    the knowledge and tools they need to make informed financial decisions and achieve financial
                    success.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Welcome;
