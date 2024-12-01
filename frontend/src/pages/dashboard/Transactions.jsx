import React, { Suspense, useState } from "react";
import ProgressBar from "components/transactions/progressBar";
import TransactionModal from "components/transactions/TransactionModal";
import TransactionsTable from "components/transactions/table/TransactionTable";
import CalendarMonth from "components/transactions/calendarMonth";
import { useParams } from "react-router-dom";
import FinanceSkeleton from "components/transactions/skeleton/TransactionSkeleton";
import Categories from "components/transactions/categories";

import { useSelector } from "react-redux";
import { selectedDateObject, transactionModal } from "services/reducers/uiSlice";
import { useGetCategoriesQuery } from "services/api/categoriesApi";
import { useGetMonthlyDataQuery } from "services/api/transactionsApi";
import ErrorFallback from "components/ErrorBoundary";

const Transaction = () => {
  const { type } = useParams();
  const modalState = useSelector(transactionModal);
  const date = useSelector(selectedDateObject);

  const { data, isLoading } = useGetMonthlyDataQuery({
    type,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  });

  const { data: userCategories, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const categories = userCategories?.categories?.filter((category) => category.type === type);

  if (isLoading || isLoadingCategories) return <FinanceSkeleton />;

  return (
    <div className="container-fluid ">
      <div className="row mt-2 gx-5" style={{ minHeight: "65vh" }}>
        <div className="col-12 col-lg-8">
          <CalendarMonth />
          <ProgressBar data={data.categories} categories={categories} total={data.total} />
        </div>
        <div className="col-12 col-lg-4">
          <Categories categories={categories} max={userCategories.maxCategories} />
        </div>
      </div>
      {date && <TransactionsTable transactions={data.transactions} total={data.total} />}
      {modalState.isOpen && <TransactionModal type={type} />}
    </div>
  );
};

export default Transaction;
