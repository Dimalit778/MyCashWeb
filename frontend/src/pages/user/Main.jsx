import React, { useState } from "react";

import Loader from "components/custom/Loader";

import LineChart from "components/charts/LineChart";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { CardStats } from "components/ui/CardStats";
import { useGetYearlyTransactionsQuery } from "api/slicesApi/transactionsApiSlice";

const Main = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data, isLoading, error } = useGetYearlyTransactionsQuery({ year });

  if (isLoading) return <Loader />;
  if (error) return <div>Error</div>;
  const { monthlyData, yearSummary } = data;

  return (
    <Container fluid>
      <div className="d-flex justify-content-center align-items-center  ">
        <Button
          className="border-1 border-light btn-sm me-4 bg-transparent"
          onClick={() => setYear((prev) => prev - 1)}
        >
          <ChevronLeft size={20} className="text-light" />
        </Button>
        <h1 className="text-light"> {year}</h1>
        <Button
          className="border-1 border-light btn-sm me-4 ms-4 bg-transparent "
          onClick={() => setYear((prev) => prev + 1)}
        >
          <ChevronRight size={20} className="text-light" />
        </Button>
      </div>

      <Row className="g-3 mt-1">
        <Col xs={12} md={4}>
          <CardStats title="Expenses" amount={yearSummary.totalExpenses} />
        </Col>
        <Col xs={12} md={4}>
          <CardStats
            title="Balance"
            amount={yearSummary.yearlyBalance}
            isBalance
            isPositive={yearSummary.yearlyBalance >= 0}
          />
        </Col>
        <Col xs={12} md={4}>
          <CardStats title="Incomes" amount={yearSummary.totalIncomes} />
        </Col>
      </Row>
      <Card className="bg-dark text-light border-light shadow-lg mt-3 ">
        <Card.Body>
          <LineChart monthlyData={monthlyData} />
        </Card.Body>
      </Card>
    </Container>
  );
};
export default Main;
