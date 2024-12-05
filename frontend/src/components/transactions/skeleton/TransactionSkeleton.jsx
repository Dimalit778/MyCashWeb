import React from "react";
import "./transactionSkeletonStyle.css";

const TransactionSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="row g-3">
        {/* First Column - Charts */}
        <div className="col-12 col-lg-8">
          <div className="skeleton-date bg-dark">
            <div className="skeleton-arrow"></div>
            <div className="skeleton-date-text"></div>
            <div className="skeleton-arrow"></div>
          </div>

          <div className="skeleton-bars">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-bar-wrapper">
                <div className="skeleton-progress">
                  <div className="skeleton-progress-bar"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Column - Pie Chart */}
        <div className="col-12 col-lg-4 ">
          <div className="px-4">
            <div className="skeleton-pie rounded p-1 ">
              <div className="skeleton-legend">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-legend-item"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className=" bg-dark mt-4 p-3  rounded">
        <div className="skeleton-table-header">
          <div className="skeleton-add-button"></div>
          <div className="skeleton-total"></div>
        </div>

        <div className="skeleton-table">
          <div className="skeleton-table-head">
            <div className="skeleton-th"></div>
            <div className="skeleton-th"></div>
            <div className="skeleton-th"></div>
            <div className="skeleton-th"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-table-row">
              <div className="skeleton-td"></div>
              <div className="skeleton-td"></div>
              <div className="skeleton-td"></div>
              <div className="skeleton-td"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionSkeleton;
