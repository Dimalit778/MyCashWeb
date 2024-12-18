import React, { useState } from "react";
import MainSkeleton from "../../components/main/skeleton";
import YearCalender from "../../components/main/yearCalendar";
import YearStats from "../../components/main/yearStats";
import YearChart from "../../components/main/yearChart";
import { useGetYearlyTransactionsQuery } from "services/api/transactionsApi";
import LoadingOverlay from "components/LoadingLayout";
import DataError from "components/DataError";

const Home = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data, isLoading, isFetching, error } = useGetYearlyTransactionsQuery(
    { year },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: false,
    }
  );

  if (error) return <DataError error={error} />;
  if (isLoading) return <MainSkeleton />;

  const { monthlyStats, yearlyStats } = data?.data;

  return (
    <div className="container-fluid d-flex flex-column gap-3  ">
      <YearCalender data-testid="year-calendar" year={year} setYear={setYear} />
      <LoadingOverlay data-testid="loading-overlay" show={isFetching}>
        <YearStats data-testid="year-stats" yearlyStats={yearlyStats} />
        <YearChart data-testid="year-chart" monthlyStats={monthlyStats} />
      </LoadingOverlay>
    </div>
  );
};
export default Home;
