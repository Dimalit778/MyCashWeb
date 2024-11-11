import { Navigate, Outlet } from "react-router-dom";

import { Col, Row } from "react-bootstrap";

import LeftSideBar from "components/navBars/leftSideBar/LeftSideBar";
import BottomBar from "components/navBars/bottomBar/BottomBar";
import TopBar from "components/navBars/topBar/TopBar";
import { useSelector } from "react-redux";
import { currentUser } from "services/store/userSlice";

const MainLayout = () => {
  const user = useSelector(currentUser);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
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

export default MainLayout;
