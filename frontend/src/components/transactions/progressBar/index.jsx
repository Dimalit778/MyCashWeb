import React from "react";

import { AnimatePresence } from "framer-motion";
import "./progressBar.css";
import ProgressBarItem from "./ProgressBarItem";
import { TABLE_COLORS } from "config/transactionsConfig";

const ProgressBars = ({ data }) => {
  const { transactions } = data;

  const categoryColors = transactions.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = TABLE_COLORS[Object.keys(acc).length % TABLE_COLORS.length];
    }
    return acc;
  }, {});

  // Then combine totals and colors
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
      color: categoryColors[category],
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
          {categoryTotals.map((item, index) => (
            <ProgressBarItem
              key={item.category}
              category={item.category}
              total={item.total}
              percentage={item.percentage}
              color={item.color}
              index={index}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ProgressBars;
