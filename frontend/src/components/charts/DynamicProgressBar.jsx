import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const DynamicProgressBars = ({ categories, total }) => {
  return (
    <div className="progress-bars-container">
      {Object.entries(categories).map(([category, amount]) => {
        const percentage = (amount / total) * 100;
        return (
          <div key={category} className="mb-2">
            <div className="d-flex justify-content-between">
              <span>{category}</span>
              <span>{percentage.toFixed(2)}%</span>
            </div>
            <ProgressBar now={percentage} label={`${percentage.toFixed(2)}%`} />
          </div>
        );
      })}
    </div>
  );
};

export default DynamicProgressBars;
