import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./mainSkeleton.css";

const MainSkeleton = () => {
  return (
    <Container fluid className="skeleton-container">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="skeleton-button me-4"></div>
        <div className="skeleton-year"></div>
        <div className="skeleton-button ms-4"></div>
      </div>

      <Row className="g-3 mt-1">
        {[1, 2, 3].map((i) => (
          <Col xs={12} md={4} key={i}>
            <div className="skeleton-card">
              <div className="skeleton-card-title"></div>
              <div className="skeleton-card-amount"></div>
            </div>
          </Col>
        ))}
      </Row>

      <div className="skeleton-chart-card  mt-4">
        <div className="skeleton-chart-legend">
          <div className="skeleton-legend-item"></div>
          <div className="skeleton-legend-item"></div>
        </div>
        <div className="skeleton-chart">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <div key={month} className="skeleton-bar-container">
              <div className="skeleton-bar"></div>
              <div className="skeleton-bar"></div>
              <div className="skeleton-month-label"></div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default MainSkeleton;
