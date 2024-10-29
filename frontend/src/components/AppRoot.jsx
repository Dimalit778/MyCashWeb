import { Outlet } from "react-router-dom";
import TopBar from "./bars/TopBar";
import { Col, Row } from "react-bootstrap";
import LeftSideBar from "./bars/LeftSideBar";
import BottomBar from "./bars/BottomBar";
import { Toaster } from "react-hot-toast";

const AppRoot = () => {
  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            marginTop: "5rem",
            border: "1px solid #713200",
            padding: "13px",
            color: "#713200",
            fontSize: "1rem",
            fontWeight: "500",
          },
        }}
      />
      <TopBar className="d-md-none" />

      <Row className="g-0">
        <Col
          md={3}
          lg={2}
          className="d-none d-md-block"
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 1030,
            backgroundColor: "black",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <LeftSideBar />
        </Col>
        <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} className="main-content p-2 ">
          <Outlet />
        </Col>
      </Row>
      <BottomBar className="d-md-none" />
    </div>
  );
};

export default AppRoot;
