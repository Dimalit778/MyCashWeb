import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import CountUp from "react-countup";
import "./chartStyle.css";
const DynamicProgressBars = ({ categories }) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div>No category data available</div>;
  }

  const total = categories.reduce((sum, category) => sum + category.total, 0);
  const colors = ["success", "info", "warning", "danger", "primary"];

  return (
    <div className="p-4">
      {categories.map((category, index) => {
        const percentage = (category.total / total) * 100;
        return (
          <div key={category._id} className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span className="fw-bold text-capitalize">{category._id}</span>
              <CountUp start={0} end={category.total} separator="," decimals={2} prefix="$" duration={2.5} />
            </div>
            <ProgressBar
              now={percentage}
              variant={colors[index % colors.length]}
              label={`${percentage.toFixed(2)}%`}
              className="custom-progress"
            />
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(DynamicProgressBars);
