import React, { useState } from "react";

import PieActiveArc from "components/charts/PieActiveArc";
import Loader from "components/Loader";
import TableView from "./TableView";
import { numberFormat } from "hooks/numberFormat";
import AddForm from "forms/AddForm";

import { Col, Container, Row } from "react-bootstrap";

import CustomCalendar from "components/calender/CustomCalendar";
import CustomProgressBar from "components/charts/DynamicProgressBar";
import FinanceChart from "components/charts/FinanceBarChart";
import FinanceBarChart from "components/charts/FinanceBarChart";
import { format } from "date-fns";
import { useGetMonthlyTransactionsQuery } from "api/slicesApi/transactionsApiSlice";

const FinanceView = ({ type }) => {
  const [date, setDate] = useState(new Date());
  const onChange = (date) => setDate(date);
  console.log("date", type);
  const {
    data: allTransactions,
    isLoading,
    error,
  } = useGetMonthlyTransactionsQuery({ date: format(date, "yyyy-MM-dd"), type: type });
  const isExpense = type === "expense";

  if (isLoading) return <Loader />;
  if (error) return <div className="text-danger">Error loading {type}s!</div>;

  const { sortByCategory, allData, totalAmount } = allTransactions;

  return (
    <Container fluid className=" text-light  ">
      <Row className="g-3 ">
        <Col className="col-12 col-lg-6 d-flex">
          <div className=" w-100 ">
            <div className="d-flex flex-column ">
              <CustomCalendar date={date} onChange={onChange} />
            </div>
            <div className="card-body d-flex flex-column mt-4 gap-3">
              {/* <CustomProgressBar list={categoryTotals} date={date} /> */}
            </div>
          </div>
        </Col>
        <div className="col-12 col-lg-6 d-flex">
          <div className="  w-100">
            <div className="card-body d-flex flex-column">
              <div className="">
                <PieActiveArc list={sortByCategory} />
                {/* <FinanceBarChart list={sortByCategory} /> */}
              </div>
            </div>
          </div>
        </div>
      </Row>
      <div className="row mt-3 bg-primary ">
        <div className="card p-0 bg-transparent">
          <div className=" p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <AddForm actionType={type} date={date} />
            </div>
            <h5 className=" mt-3 text-center text-light">
              Total {isExpense ? "Expenses" : "Incomes"}: {numberFormat(totalAmount)}
            </h5>
            <div>
              <TableView list={allData} actionType={type} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FinanceView;
