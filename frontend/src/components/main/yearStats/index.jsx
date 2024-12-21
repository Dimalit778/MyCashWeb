import React from "react";

import StatsCard from "./StatsCard";

const YearStats = ({ yearlyStats }) => {
  const stats = [
    {
      title: "Expenses",
      amount: yearlyStats.totalExpenses,
      dataCy: "stats-expenses",
    },
    {
      title: "Balance",
      amount: yearlyStats.balance,
      isBalance: true,
      isPositive: yearlyStats.balance >= 0,
      dataCy: "stats-balance",
    },
    {
      title: "Incomes",
      amount: yearlyStats.totalIncomes,
      dataCy: "stats-incomes",
    },
  ];

  return (
    <div data-cy="year-stats" className="row g-3 px-2 ">
      {stats.map((stat) => (
        <div className="col-12 col-sm-4" key={stat.title}>
          <StatsCard {...stat} />
        </div>
      ))}
    </div>
  );
};

export default YearStats;
