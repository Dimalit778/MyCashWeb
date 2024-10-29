import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  DynamicProgressBar,
  MonthlyPieChart,
  TransactionForm,
  TransactionsTable,
  TransactionProvider,
  CalenderMonth,
} from "components/transactions";

const Expenses = () => {
  return (
    <TransactionProvider type="Expense">
      <Container fluid>
        <Row style={{ minHeight: "70vh" }}>
          <Col sm={12} lg={6}>
            <CalenderMonth />
            <DynamicProgressBar />
          </Col>
          <Col sm={12} lg={6}>
            <MonthlyPieChart />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="mt-5 ">
            <TransactionsTable />
          </Col>
        </Row>
      </Container>
      <TransactionForm />
    </TransactionProvider>
  );
};

export default Expenses;
