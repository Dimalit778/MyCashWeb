import React, { useState, useMemo } from "react";
import { useGetAllExpensesQuery } from "api/slicesApi/expenseApiSlice";
import { useGetAllIncomesQuery } from "api/slicesApi/incomeApiSlice";
import CalendarYearMonth from "components/calender/CalendarYearMonth";
import PieActiveArc from "components/charts/PieActiveArc";
import Loader from "components/Loader";
import TableView from "./TableView";

import { filterByMonthAndYear } from "hooks/filterByMonthYear";
import { calculateTotal } from "hooks/calculateTotal";
import { numberFormat } from "hooks/numberFormat";
import AddForm from "forms/AddForm";

const FinanceView = ({ type }) => {
  const [date, setDate] = useState(new Date());
  const onChange = (date) => setDate(date);
  const { data: allExpenses, isLoading: expensesLoading, error: expensesError } = useGetAllExpensesQuery();
  const { data: allIncomes, isLoading: incomesLoading, error: incomesError } = useGetAllIncomesQuery();

  const isExpense = type === "expense";
  const allItems = isExpense ? allExpenses : allIncomes;
  const isLoading = isExpense ? expensesLoading : incomesLoading;
  const error = isExpense ? expensesError : incomesError;
  const filteredList = useMemo(() => (allItems ? filterByMonthAndYear(allItems, date) : []), [allItems, date]);

  const total = useMemo(() => calculateTotal(filteredList), [filteredList]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-danger">Error loading {type}s!</div>;

  return (
    <div className="container-fluid  py-4">
      <div className="row">
        <div className="col-12 col-lg-6 mb-4">
          <div className="card bg-transparent">
            <div className="card-body">
              <h2 className="card-title text-center text-info mb-4">Monthly {isExpense ? "Expenses" : "Incomes"}</h2>
              <div style={{ height: "250px" }}>
                <PieActiveArc list={allItems} date={date} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card bg-secondary mb-4 ">
            <div className="card-body">
              <CalendarYearMonth onChange={onChange} date={date} />
            </div>
            <div className="mt-3 d-flex justify-content-center bg-primary">
              <h4 className="text-light">
                Total {isExpense ? "Expenses" : "Incomes"}: {numberFormat(total)}
              </h4>
            </div>
          </div>
        </div>
        <div className="card bg-transparent">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <AddForm actionType={type} date={date} />
            </div>
            <TableView list={filteredList} actionType={type} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
