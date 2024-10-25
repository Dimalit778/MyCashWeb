import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  DynamicProgressBar,
  MonthlyCalendar,
  MonthlyPieChart,
  TransactionForm,
  TransactionsTable,
  TransactionProvider,
} from "components/transactions";

const Expenses = () => {
  return (
    <TransactionProvider type="Expense">
      <Container fluid className="border-1 border border-light">
        <Row className="g-3" style={{ minHeight: "70vh" }}>
          <Col sm={12} lg={6}>
            <MonthlyCalendar />
            <DynamicProgressBar />
          </Col>
          <Col sm={12} lg={6} className="d-flex justify-content-center">
            <MonthlyPieChart />
          </Col>
        </Row>
        <Row className="mt-3 px-2">
          <Col sm={12}>
            <TransactionsTable />
          </Col>
        </Row>
      </Container>
      <TransactionForm />
    </TransactionProvider>
  );
};

export default Expenses;
