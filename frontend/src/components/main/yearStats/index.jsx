import React from "react";

import StatsCard from "./StatsCard";

const YearStats = ({ yearlyStats }) => {
  const stats = [
    {
      title: "Expenses",
      amount: yearlyStats.totalExpenses,
      dataCy: "expenses",
    },
    {
      title: "Balance",
      amount: yearlyStats.totalBalance,
      isBalance: true,
      isPositive: yearlyStats.totalBalance >= 0,
      dataCy: "balance",
    },
    {
      title: "Incomes",
      amount: yearlyStats.totalIncomes,
      dataCy: "incomes",
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
