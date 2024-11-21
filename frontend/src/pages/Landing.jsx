import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import groupImg from "assets/welcomeImages/group.jpg";

import Footer from "components/ui/footer/footer";
import styles from "components/landing/landing.module.css";
import { motion } from "framer-motion";
import LandingAnimation from "components/landing/animation";

const Landing = () => {
  return (
    <div className={styles.welcomeWrapper}>
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h1 className={`${styles.mainTitle} mb-0`} data-testid="main-title">
                  MANAGE YOUR
                </h1>
                <h1 className={styles.strokeTitle} data-testid="stroke-title">
                  MONEY
                </h1>
                <div className={styles.animationWrapper} data-testid="animation-wrapper">
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                    <LandingAnimation data-testid="welcome-animation" />
                  </motion.div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className={styles.aboutSection}>
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <div className={styles.imageContainer} data-testid="about-image-container">
                  <img src={groupImg} alt="Team" className={styles.aboutImage} data-testid="team-image" />
                </div>
              </Col>
              <Col lg={6}>
                <div className={styles.aboutContent} data-testid="about-content">
                  <h2 className={styles.sectionTitle} data-testid="about-title">
                    About Us
                  </h2>
                  <p className={styles.aboutText} data-testid="about-text-1">
                    CashFlow is a financial planning firm based in Jerusalem...
                  </p>
                  <p className={styles.aboutText} data-testid="about-text-2">
                    CashFlow is a financial planning firm based in Jerusalem, providing comprehensive financial planning
                    services to individuals and businesses. Our team of experts is dedicated to helping our clients
                    achieve their financial goals by providing them with personalized and customized solutions.
                  </p>
                  <p className={styles.aboutText}>
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

export default Landing;
