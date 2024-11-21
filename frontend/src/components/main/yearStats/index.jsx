import React from "react";

import StatsCard from "./StatsCard";

const YearStats = ({ yearSummary }) => {
  const stats = [
    {
      title: "Expenses",
      amount: yearSummary.totalExpenses,
    },
    {
      title: "Balance",
      amount: yearSummary.yearlyBalance,
      isBalance: true,
      isPositive: yearSummary.yearlyBalance >= 0,
    },
    {
      title: "Incomes",
      amount: yearSummary.totalIncomes,
    },
  ];

  return (
    <div className="row g-3 px-2">
      {stats.map((stat) => (
        <div className="col-12 col-sm-4" key={stat.title}>
          <StatsCard {...stat} />
        </div>
      ))}
    </div>
  );
};

export default YearStats;
