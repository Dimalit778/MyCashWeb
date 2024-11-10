import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import groupImg from "assets/welcomeImages/group.jpg";
import WelcomeAnimation from "components/ui/WelcomeAnimation";
import Footer from "components/layout/footer/footer";
import "styles/WelcomeStyle.css";
import { motion } from "framer-motion";
const Landing = () => {
  return (
    <div className="welcome-wrapper" data-testid="welcome-page">
      <main className="main-content">
        <section className="hero-section" data-testid="hero-section">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h1 className="main-title mb-0" data-testid="main-title">
                  MANAGE YOUR
                </h1>
                <h1 className="stroke-title" data-testid="stroke-title">
                  MONEY
                </h1>
                <div className="animation-wrapper" data-testid="animation-wrapper">
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                    <WelcomeAnimation data-testid="welcome-animation" />
                  </motion.div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* About Section */}

        <section className="about-section" data-testid="about-section">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <div className="image-container" data-testid="about-image-container">
                  <img src={groupImg} alt="Team" className="about-image" data-testid="team-image" />
                </div>
              </Col>
              <Col lg={6}>
                <div className="about-content" data-testid="about-content">
                  <h2 className="section-title" data-testid="about-title">
                    About Us
                  </h2>
                  <p className="about-text" data-testid="about-text-1">
                    CashFlow is a financial planning firm based in Jerusalem...
                  </p>
                  <p className="about-text" data-testid="about-text-2">
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
      <Footer data-testid="footer" />
    </div>
  );
};

export default Landing;
