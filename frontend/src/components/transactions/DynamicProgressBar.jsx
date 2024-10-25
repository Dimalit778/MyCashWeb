import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import CountUp from "react-countup";
import "styles/DynamicProgressBarStyle.css";
import { useTransactionContext } from "./TransactionProvider";

const DynamicProgressBars = () => {
  const { data, categories: userCategories, isLoading } = useTransactionContext();

  if (isLoading) return <div>Loading progress bars...</div>;

  const existingCategories = data?.sortByCategory || [];
  const total = existingCategories.reduce((sum, category) => sum + category.total, 0);
  const colors = ["success", "info", "warning", "danger", "primary"];

  // Create a map of existing categories for easy lookup
  const categoryTotals = Object.fromEntries(existingCategories.map((cat) => [cat._id, cat.total]));

  // Combine user categories with existing data
  const allCategories = userCategories.map((category) => ({
    _id: category,
    total: categoryTotals[category] || 0,
  }));

  return (
    <div className="p-3 mt-2">
      {allCategories.map((category, index) => {
        const percentage = total > 0 ? (category.total / total) * 100 : 0;
        return (
          <div key={category._id} className="mb-2">
            <div className="d-flex justify-content-between mb-1 align-items-center">
              <span className="fw-bold text-capitalize small-text">{category._id}</span>
              <span className="small-text">
                <CountUp start={0} end={category.total} separator="," decimals={2} prefix="$" duration={2.5} />
              </span>
            </div>
            <ProgressBar
              now={percentage || 0}
              variant={colors[index % colors.length]}
              label={percentage ? `${percentage.toFixed(2)}%` : null}
              className="custom-progress"
            />
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(DynamicProgressBars);
