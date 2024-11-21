import React, { useMemo } from "react";
import ProgressBar from "components/transactions/progressBar";
import TransactionModal from "components/transactions/TransactionModal";
import TransactionsTable from "components/transactions/table/TransactionTable";
import CalendarMonth from "components/transactions/calendarMonth";
import MonthlyChart from "components/transactions/monthlyChart";
import { useParams } from "react-router-dom";

import { useGetYearlyTransactionsQuery } from "services/api/transactionsApi";
import { groupTransactionsByCategory } from "utils/groupTransactionsByCategory";
import FinanceSkeleton from "components/transactions/skeleton/TransactionSkeleton";
import { useSelector } from "react-redux";
import { selectedDateObject, transactionModal } from "services/reducers/uiSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { EXPENSE_TYPE, INCOME_TYPE } from "config/global";
import Categories from "components/transactions/categories";

const Transaction = () => {
  const { type } = useParams();
  const dateObject = useSelector(selectedDateObject);
  const modalState = useSelector(transactionModal);
  const currentYear = dateObject.getFullYear();
  const currentMonth = dateObject.getMonth() + 1;

  const {
    data: yearlyData,
    isLoading,
    error,
  } = useGetYearlyTransactionsQuery(currentYear ? { year: currentYear } : skipToken);
  console.log(yearlyData);

  const monthlyData = useMemo(() => {
    if (!yearlyData?.monthlyData) return null;

    const monthData = yearlyData.monthlyData.find((m) => m.month === currentMonth);

    if (!monthData) return null;

    return {
      transactions: type === EXPENSE_TYPE ? monthData.expenseTransactions : monthData.incomeTransactions,
      total: type === EXPENSE_TYPE ? monthData.expenses : monthData.incomes,
      sortByCategory: groupTransactionsByCategory(
        type === EXPENSE_TYPE ? monthData.expenseTransactions : monthData.incomeTransactions
      ),
    };
  }, [yearlyData, currentMonth, type]);

  if (error) {
    console.error("Failed to fetch transactions:", error);
    return <div>Failed to load data. Please try again later.</div>;
  }
  if (isLoading) return <FinanceSkeleton />;
  if (type !== EXPENSE_TYPE && type !== INCOME_TYPE) return <div>Invalid type</div>;
  console.log("monthlyData", monthlyData);
  return (
    <div className="container-fluid">
      <div className="row" style={{ minHeight: "70vh" }}>
        <div className="col-12 col-md-6">
          <CalendarMonth />
          {/* <ProgressBar data={monthlyData?.sortByCategory} totalSum={monthlyData?.total} /> */}
        </div>
        <div className="col-12 col-md-6">{/* <MonthlyChart data={monthlyData?.sortByCategory} /> */}</div>
      </div>
      <div className="col-12 ">
        {/* <TransactionsTable data={monthlyData?.transactions} total={monthlyData?.total} type={type} /> */}
        <Categories type={type} />
      </div>
      {/* {modalState.isOpen && <TransactionModal />} */}
    </div>
  );
};

export default Transaction;
