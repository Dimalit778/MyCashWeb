import React, { useState } from "react";

import MainSkeleton from "./skeleton";
import YearCalender from "./components/yearCalendar";
import YearStats from "./components/yearStats";
import YearChart from "./components/yearChart";
import Categories from "./components/categories";
import { useGetYearlyTransactionsQuery } from "services/api/transactionsApi";

const Main = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data, isLoading, error } = useGetYearlyTransactionsQuery(
    { year },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: false,
    }
  );

  if (error) {
    console.error("Failed to fetch transactions:", error);
    return <div>Failed to load data. Please try again later.</div>;
  }

  if (isLoading) return <MainSkeleton />;

  const { monthlyData = [], yearSummary = {} } = data || {};

  return (
    <div className="d-flex flex-column gap-4 ">
      <YearCalender year={year} setYear={setYear} />
      <YearStats yearSummary={yearSummary} />
      <YearChart monthlyData={monthlyData} />
      <Categories />
    </div>
  );
};
export default Main;
