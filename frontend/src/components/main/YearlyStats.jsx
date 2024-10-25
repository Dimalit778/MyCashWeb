import React from "react";
import CountUp from "react-countup";

const StatsCard = ({ title, amount, isBalance = false, isPositive = false }) => {
  const backgroundGradients = {
    Expenses: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    Incomes: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    Balance: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  };

  return (
    <div
      className="p-2 rounded-3 shadow-sm text-center mx-3"
      style={{
        background: backgroundGradients[title] || backgroundGradients.Balance,
        transition: "all 0.3s ease",
      }}
    >
      <div className="d-flex flex-column">
        <h3 className="text-uppercase">{title}</h3>
        <h4
          style={{
            color: isBalance ? (isPositive ? "#28a745" : "#dc3545") : "#333",
          }}
        >
          <CountUp start={0} end={amount} separator="," decimals={2} prefix="$" duration={2.5} />
        </h4>
      </div>
    </div>
  );
};

const YearlyStats = ({ yearSummary }) => {
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
    <div className="row g-3 mt-1 bg-body">
      {stats.map((stat) => (
        <div className="col-12 col-lg-4" key={stat.title}>
          <StatsCard {...stat} />
        </div>
      ))}
    </div>
  );
};

export default YearlyStats;
