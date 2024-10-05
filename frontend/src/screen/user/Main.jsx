import React, { useMemo, useState } from "react";

import { useGetAllExpensesQuery } from "api/slicesApi/expenseApiSlice";
import { useGetAllIncomesQuery } from "api/slicesApi/incomeApiSlice";
import Loader from "components/Loader";
import { calculateTotal } from "hooks/calculateTotal";
import { totalBalance } from "hooks/totalBalance";
import LineChart from "components/charts/LineChart";
import { filterByYear } from "hooks/filterByYear";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Card, Col, Container, Row } from "react-bootstrap";
import FinancialStats from "components/ui/FinanceStats";
import { fakeExpenses, fakeIncomes } from "fakedata";

const Main = () => {
  const currentYear = new Date().getFullYear();
  const [chosenYear, setChosenYear] = useState(currentYear);

  // const { data: allExpenses, isLoading: loadExpenses } = useGetAllExpensesQuery();
  // const { data: allIncomes, isLoading: loadIncomes } = useGetAllIncomesQuery();
  const allExpenses = fakeExpenses;
  const allIncomes = fakeIncomes;

  const memoizedData = useMemo(() => {
    // if (loadIncomes || loadExpenses) return null;

    const expenses_list = allExpenses ? filterByYear(allExpenses, chosenYear) : [];
    const incomes_list = allIncomes ? filterByYear(allIncomes, chosenYear) : [];

    const expenses = calculateTotal(expenses_list);
    const incomes = calculateTotal(incomes_list);
    const total = totalBalance(expenses, incomes);

    return {
      expenses,
      incomes,
      total,
      expenses_list,
      incomes_list,
    };
  }, [allExpenses, allIncomes, chosenYear]);

  if (!memoizedData) return <Loader />;

  const { expenses, incomes, total, expenses_list, incomes_list } = memoizedData;

  return (
    <Container fluid className="  ">
      <div className="d-flex justify-content-center align-items-center   ">
        <button className="btn btn-outline-light btn-sm me-4" onClick={() => setChosenYear((prev) => prev - 1)}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="mb-0 fw-bold text-light">{chosenYear}</h1>
        <button className="btn btn-outline-light btn-sm ms-4" onClick={() => setChosenYear((prev) => prev + 1)}>
          <ChevronRight size={20} />
        </button>
      </div>

      <Row className="g-2 mb-3">
        <Col xs={4}>
          <FinancialStats type="expenses" amount={expenses} />
        </Col>
        <Col xs={4}>
          <FinancialStats type="balance" amount={total} />
        </Col>
        <Col xs={4}>
          <FinancialStats type="incomes" amount={incomes} />
        </Col>
      </Row>

      <Card className="bg-dark text-light border-light shadow-lg mb-5 ">
        <Card.Body>
          <LineChart allExpenses={expenses_list} allIncomes={incomes_list} />
        </Card.Body>
      </Card>
      <Card className="bg-dark text-light border-light shadow-lg ">
        <Card.Body>
          <LineChart allExpenses={expenses_list} allIncomes={incomes_list} />
        </Card.Body>
      </Card>
    </Container>
  );
};
export default Main;
