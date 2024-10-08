import React from "react";

import CountUp from "react-countup";

export const CardStats = ({ title, amount, isBalance, isPositive }) => {
  const getBackgroundColor = () => {
    if (title === "Expenses") return "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)";
    if (title === "Incomes") return "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)";
    return "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"; // Balance
  };

  const getTextColor = () => {
    if (isBalance) return isPositive ? "#28a745" : "#dc3545";
    return "#333";
  };

  return (
    <div
      className="p-2 rounded-3 shadow-sm text-center mx-3 "
      style={{
        background: getBackgroundColor(),
        transition: "all 0.3s ease",
      }}
    >
      <div className="d-flex flex-column">
        <h3 className=" text-uppercase">{title}</h3>
        <h4
          style={{
            color: getTextColor(),
          }}
        >
          <CountUp start={0} end={amount} separator="," decimals={2} prefix="$" duration={2.5} />
        </h4>
      </div>
    </div>
  );
};

export default CardStats;
