import React, { useState } from "react";
import { useGetYearlyTransactionsQuery } from "api/slicesApi/transactionsApiSlice";
import { Categories, YearlyCalender, YearlyLineChart, YearlyStats, MainSkeleton } from "components/main";

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
      <YearlyCalender year={year} setYear={setYear} />
      <YearlyStats yearSummary={yearSummary} />
      <YearlyLineChart monthlyData={monthlyData} />
      <Categories />
    </div>
  );
};
export default Main;
