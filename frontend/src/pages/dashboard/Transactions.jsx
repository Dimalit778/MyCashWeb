import React, { useState } from "react";
import ProgressBar from "components/transactions/progressBar";
import TransactionModal from "components/transactions/TransactionModal";
import TransactionsTable from "components/transactions/table/TransactionTable";
import CalendarMonth from "components/transactions/calendarMonth";
import { useParams } from "react-router-dom";

import Categories from "components/transactions/categories";

import { useSelector } from "react-redux";
import { transactionModal } from "services/reducers/uiSlice";
import { useGetCategoriesQuery } from "services/api/categoriesApi";
import { useGetMonthlyTransactionsQuery } from "services/api/transactionsApi";
import LoadingOverlay from "components/LoadingLayout";
import TransactionSkeleton from "components/transactions/skeleton/TransactionSkeleton";
import DataError from "components/DataError";

const Transaction = () => {
  const { type } = useParams();
  const modalState = useSelector(transactionModal);
  const [date, setDate] = useState(new Date());

  const {
    data: monthlyData,
    isLoading: loadingData,
    isFetching: fetchingData,
    error: monthError,
  } = useGetMonthlyTransactionsQuery({
    type,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  });

  const {
    data: userCategories,
    isFetching: fetchingCategories,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const categories = userCategories?.data.categories?.filter((category) => category.type === type);

  if (loadingData || loadingCategories) return <TransactionSkeleton />;
  if (monthError || categoriesError) return <DataError error={monthError || categoriesError} />;

  return (
    <LoadingOverlay dataCy="loading" show={fetchingData || fetchingCategories}>
      <div className="container-fluid ">
        <div className="row mt-2 gx-5" style={{ minHeight: "45vh" }}>
          <div className="col-12 col-lg-8">
            <CalendarMonth date={date} setDate={setDate} />

            <ProgressBar data={monthlyData?.data.categories} categories={categories} total={monthlyData?.data.total} />
          </div>
          <div className="col-12 col-lg-4">
            <Categories categories={categories} max={userCategories.data.maxCategories} />
          </div>
        </div>

        <TransactionsTable
          transactions={monthlyData?.data.transactions}
          total={monthlyData?.data.transactions}
          type={type}
        />

        {modalState.isOpen && <TransactionModal type={type} date={date} />}
      </div>
    </LoadingOverlay>
  );
};

export default Transaction;
