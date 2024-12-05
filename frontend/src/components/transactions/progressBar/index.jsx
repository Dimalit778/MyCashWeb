import React from "react";

import { AnimatePresence } from "framer-motion";
import "./progressBar.css";
import ProgressBarItem from "./ProgressBarItem";

const ProgressBars = ({ data, categories, total }) => {
  const processedCategories = () => {
    if (!total) return []; // Return empty array if total is 0

    return data
      .map((category) => ({
        ...category,
        percentage: ((category.total / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.total - a.total);
  };

  const processed = processedCategories();
  if (!processed.length) {
    return (
      <div
        className=" d-flex align-items-center justify-content-center"
        style={{
          minHeight: "20vh",
          borderRadius: "8px",
        }}
      >
        <h3 className="text-secondary">No Item in Progress bar </h3>
      </div>
    );
  }

  return (
    <div className="progress-container mt-3">
      <AnimatePresence>
        <div
          className="d-grid gap-3"
          style={{
            gridTemplateColumns: processed?.length > 5 ? "repeat(2, 1fr)" : "1fr",
          }}
        >
          {processed.map((category, index) => (
            <ProgressBarItem
              key={index}
              category={category.category}
              total={category.total}
              percentage={category.percentage}
              index={index}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ProgressBars;
