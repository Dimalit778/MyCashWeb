import React from "react";
import "./financeSkeletonStyle.css";

const FinanceSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="row g-3">
        {/* First Column - Charts */}
        <div className="col-12 col-lg-6">
          <div className="skeleton-date">
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
        <div className="col-12 col-lg-6 d-flex justify-content-center align-items-start">
          <div className="skeleton-pie-container">
            <div className="skeleton-pie"></div>
            <div className="skeleton-legend">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-legend-item">
                  <div className="skeleton-legend-color"></div>
                  <div className="skeleton-legend-text"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="skeleton-table-section mt-4">
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

export default FinanceSkeleton;
