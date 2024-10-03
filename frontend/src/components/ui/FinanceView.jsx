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
import { fakeExpenses, fakeIncomes } from "fakedata";
import SwipeableCalendar from "components/calender/MobileCalender";
import MobileCalendar from "components/calender/MobileCalender";

const FinanceView = ({ type }) => {
  const [date, setDate] = useState(new Date());
  const onChange = (date) => setDate(date);
  // const { data: allExpenses, isLoading: expensesLoading, error: expensesError } = useGetAllExpensesQuery();
  // const { data: allIncomes, isLoading: incomesLoading, error: incomesError } = useGetAllIncomesQuery();
  const allExpenses = fakeExpenses;
  const allIncomes = fakeIncomes;
  const isExpense = type === "expense";
  const allItems = isExpense ? allExpenses : allIncomes;
  // const isLoading = isExpense ? expensesLoading : incomesLoading;
  // const error = isExpense ? expensesError : incomesError;
  const filteredList = useMemo(() => (allItems ? filterByMonthAndYear(allItems, date) : []), [allItems, date]);

  const total = useMemo(() => calculateTotal(filteredList), [filteredList]);

  // if (isLoading) return <Loader />;
  // if (error) return <div className="text-danger">Error loading {type}s!</div>;
  console.log("wid" + window.innerWidth);
  return (
    <div className="container-fluid  ">
      <div className="row g-3 ">
        <div className="col-12 col-lg-6 d-flex">
          <div className=" w-100 ">
            <div className="d-flex flex-column ">
              {window.innerWidth < 768 ? (
                <MobileCalendar onChange={onChange} date={date} />
              ) : (
                <CalendarYearMonth onChange={onChange} date={date} />
              )}
              <h5 className="text-light mt-3 text-center">
                Total {isExpense ? "Expenses" : "Incomes"}: {numberFormat(total)}
              </h5>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 d-flex">
          <div className="  w-100">
            <div className="card-body d-flex flex-column">
              <div className="">
                <PieActiveArc list={allItems} date={date} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="card p-0 bg-transparent">
          <div className=" p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <AddForm actionType={type} date={date} />
            </div>
            <div>
              <TableView list={filteredList} actionType={type} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
