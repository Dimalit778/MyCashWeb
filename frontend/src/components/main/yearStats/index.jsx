import React from "react";

import StatsCard from "./StatsCard";

const YearStats = ({ yearlyStats }) => {
  const stats = [
    {
      title: "Expenses",
      amount: yearlyStats.totalExpenses,
      dataCy: "total-expenses",
    },
    {
      title: "Balance",
      amount: yearlyStats.totalBalance,
      isBalance: true,
      isPositive: yearlyStats.totalBalance >= 0,
      dataCy: "total-balance",
    },
    {
      title: "Incomes",
      amount: yearlyStats.totalIncomes,
      dataCy: "total-incomes",
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
