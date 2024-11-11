import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import ProgressBar from "./components/progressBar";
import TransactionModal from "./components/TransactionModal";
import TransactionsTable from "./components/TransactionsTable";
import CalenderMonth from "./components/calendarMonth";
import MonthlyPieChart from "./components/monthlyChart";
import { TransactionProvider } from "./context/TransactionProvider";
import { useParams } from "react-router-dom";
import { useTransaction } from "hooks/useTransaction";

const Transaction = () => {
  const { type } = useParams();
  const { isLoading, data, error } = useTransaction(type);
  console.log("data", data);
  return (
    <TransactionProvider type={type}>
      <Container fluid>
        <Row style={{ minHeight: "70vh" }}>
          <Col sm={12} lg={6}>
            <CalenderMonth />
            <ProgressBar />
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
