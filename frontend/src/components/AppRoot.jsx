import { Outlet } from "react-router-dom";
import TopBar from "./bars/TopBar";
import { Col, Container, Row } from "react-bootstrap";
import LeftSideBar from "./bars/LeftSideBar";
import BottomBar from "./bars/BottomBar";
import { Toaster } from "react-hot-toast";
const AppRoot = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            marginTop: "5rem",
            border: "1px solid #713200",
            padding: "13px",
            color: "#713200",
          },
        }}
      />
      <div className="d-flex flex-column  min-vh-100" style={{ backgroundColor: "black" }}>
        <TopBar className="d-md-none sticky-top" />
        <Container fluid className="flex-grow-1 p-3  ">
          <Row>
            <Col
              md={3}
              lg={2}
              className="p-0 d-none d-md-block border-end border-1 border-secondary "
              style={{ position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100, padding: 0, overflowY: "auto" }}
            >
              <LeftSideBar />
            </Col>
            <Col xs={12} md={9} lg={10} className="p-0 ms-auto mb-5 mb-md-0">
              <Outlet />
            </Col>
          </Row>
        </Container>

        <BottomBar className="d-md-none " style={{ position: "fixed", bottom: 0, left: 0, right: 0 }} />
      </div>
    </>
  );
};
export default AppRoot;
