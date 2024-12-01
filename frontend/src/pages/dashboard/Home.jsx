import React, { useState } from "react";

import MainSkeleton from "../../components/main/skeleton";
import YearCalender from "../../components/main/yearCalendar";
import YearStats from "../../components/main/yearStats";
import YearChart from "../../components/main/yearChart";

import { useGetYearlyTransactionsQuery } from "services/api/transactionsApi";

const Home = () => {
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
  console.log(data);
  if (error) {
    console.error("Failed to fetch transactions:", error);
    return <div>Failed to load data. Please try again later.</div>;
  }

  if (isLoading) return <MainSkeleton />;

  return (
    <div className="d-flex flex-column gap-4 ">
      <YearCalender year={year} setYear={setYear} />
      <YearStats yearlyStats={data?.yearlyStats} />
      <YearChart monthlyStats={data?.monthlyStats} />
    </div>
  );
};
export default Home;
