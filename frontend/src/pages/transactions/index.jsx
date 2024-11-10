import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import DynamicProgressBars from "./components/DynamicProgressBars";
import TransactionModal from "./components/TransactionModal";
import TransactionsTable from "./components/TransactionsTable";
import CalenderMonth from "./components/CalendarMonth";
import MonthlyPieChart from "./components/MonthlyPieChart";
import { TransactionProvider } from "./context/TransactionProvider";

const Transaction = ({ transType }) => {
  return (
    <TransactionProvider type={transType}>
      <Container fluid>
        <Row style={{ minHeight: "70vh" }}>
          <Col sm={12} lg={6}>
            <CalenderMonth />
            <DynamicProgressBars />
          </Col>
          <Col sm={12} lg={6}>
            <MonthlyPieChart />
          </Col>
          <Col sm={12} className="mt-5">
            <TransactionModal />
            <TransactionsTable />
          </Col>
        </Row>
      </Container>
    </TransactionProvider>
  );
};

export default Transaction;
