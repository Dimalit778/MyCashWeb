import React from "react";

import { AnimatePresence } from "framer-motion";
import "./progressBar.css";
import ProgressBarItem from "./ProgressBarItem";

const ProgressBars = ({ data }) => {
  const { transactions } = data;
  const categoryTotals = Object.entries(
    transactions.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {})
  )
    .map(([category, total]) => ({
      category,
      total,
      percentage: ((total / data.total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.total - a.total);
  return (
    <div data-cy="progress-container" className="progress-container mt-3">
      <AnimatePresence>
        <div
          className="d-grid gap-3"
          style={{
            gridTemplateColumns: categoryTotals?.length > 5 ? "repeat(2, 1fr)" : "1fr",
          }}
        >
          {categoryTotals.map((category, index) => (
            <ProgressBarItem key={index} category={category.category} {...category} index={index} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ProgressBars;
