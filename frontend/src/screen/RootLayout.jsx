import LeftSideBar from "components/bars/LeftSideBar";
import TopBar from "components/bars/TopBar";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import BottomBar from "components/bars/BottomBar";
import { useSelector } from "react-redux";
import "app.css";

const RootLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if (!userInfo) return <Navigate to="/login" replace />;

  return (
    <div className=" d-flex flex-column bg-dark min-vh-100   ">
      <TopBar className="d-md-none sticky-top" />
      <Container fluid className="flex-grow-1 p-3  ">
        <Row className=" m-0 ">
          <Col
            md={3}
            lg={2}
            className="p-0 d-none d-md-block border-end border-1 border-secondary "
            style={{ position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100, padding: 0, overflowY: "auto" }}
          >
            <LeftSideBar />
          </Col>
          <Col
            xs={12}
            md={9}
            lg={10}
            className="p-0"
            style={{
              marginLeft: "auto",
              marginBottom: "30px",
            }}
          >
            <Outlet />
          </Col>
        </Row>
      </Container>

      <BottomBar className="d-md-none" />
    </div>
  );
};

export default RootLayout;
