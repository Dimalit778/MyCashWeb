import React, { useMemo } from "react";
import ProgressBar from "./components/progressBar";
import TransactionModal from "./components/TransactionModal";
import TransactionsTable from "./components/table";
import CalendarMonth from "./components/calendarMonth";
import MonthlyChart from "./components/monthlyChart";
import { useParams } from "react-router-dom";

import { useGetYearlyTransactionsQuery } from "services/api/transactionsApi";
import { groupTransactionsByCategory } from "./helpers/groupTransactionsByCategory";
import FinanceSkeleton from "./skeleton/TransactionSkeleton";
import { useSelector } from "react-redux";
import { selectedDateObject, transactionModal } from "services/reducers/uiSlice";

const Transaction = () => {
  const { type } = useParams();
  const modal = useSelector(transactionModal);
  console.log(modal);
  const dateObject = useSelector(selectedDateObject);

  const currentYear = dateObject.getFullYear();
  const currentMonth = dateObject.getMonth() + 1;

  const { data: yearlyData, isLoading } = useGetYearlyTransactionsQuery({ year: currentYear });

  // Get selected month's data
  const monthlyData = useMemo(() => {
    if (!yearlyData?.monthlyData) return null;
    const monthData = yearlyData.monthlyData.find((m) => m.month === currentMonth);
    if (!monthData) return null;

    return {
      transactions: type === "expense" ? monthData.expenseTransactions : monthData.incomeTransactions,
      total: type === "expense" ? monthData.expenses : monthData.incomes,
      sortByCategory: groupTransactionsByCategory(
        type === "expense" ? monthData.expenseTransactions : monthData.incomeTransactions
      ),
    };
  }, [yearlyData, currentMonth, type]);

  if (isLoading) return <FinanceSkeleton />;

  return (
    <div className="container-fluid">
      <div className="row" style={{ minHeight: "70vh" }}>
        <div className="col-12 col-md-6">
          <CalendarMonth />
          <ProgressBar data={monthlyData?.sortByCategory} totalSum={monthlyData?.total} />
        </div>
        <div className="col-12 col-md-6">
          <MonthlyChart data={monthlyData?.sortByCategory} />
        </div>
      </div>
      <div className="col-12 ">
        <TransactionsTable data={monthlyData?.transactions} total={monthlyData?.total} type={type} />
      </div>

      <TransactionModal />
    </div>
  );
};

export default Transaction;
