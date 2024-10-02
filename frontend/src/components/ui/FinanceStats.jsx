import React from "react";
import "./ui.css";
import "custom.css";
import CountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";

export const FinancialStats = React.memo(({ type, amount }) => {
  const data = {
    expenses: {
      title: "Expenses",
      icon: faArrowTrendUp,
      colorClass: "border-danger",
      bgClass: "bg-primary",
      color: "white",
    },
    incomes: {
      title: "Incomes",
      icon: faArrowTrendDown,
      colorClass: "border-success",
      bgClass: "bg-primary",
      color: "white",
    },
    balance: {
      title: "Balance",
      icon: faHandHoldingDollar,
      colorClass: "border-info",
      bgClass: "bg-info",
      color: "dark",
    },
  };

  const isBalance = type === "balance";
  const isPositive = isBalance && amount >= 0;
  const { title, icon, colorClass, bgClass, color } = data[type] || data.expenses;

  return (
    <div className={`stats-card border-2 ${colorClass} p-2`}>
      <div className="row g-2">
        <div className="col-12 col-md-8 d-flex flex-column align-items-center">
          <h2
            style={{
              fontFamily: "Orbitron",
              fontStyle: "italic",
            }}
          >
            {title}
          </h2>
          <h3 className={`fw-semibold ${isBalance ? (isPositive ? "text-success" : "text-danger") : ""}`}>
            <CountUp start={0} end={amount} separator="," decimals={2} prefix="$" />
          </h3>
        </div>
        <div className="col-12 col-md-4 d-flex align-items-center justify-content-center">
          <FontAwesomeIcon
            icon={icon}
            className={`respIcon ${bgClass} text-${color} border-2 border-${color}`}
            border
          />
        </div>
      </div>
    </div>
  );
});

export default FinancialStats;
