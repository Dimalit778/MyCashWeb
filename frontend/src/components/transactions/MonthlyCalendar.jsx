import React, { useState } from "react";
import { format, addMonths, subMonths, addYears, subYears } from "date-fns";
import "styles/MonthlyCalendarStyle.css";
import { useTransactionContext } from "components/transactions/TransactionProvider";

const MonthlyCalendar = () => {
  const { date, setDate } = useTransactionContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentDate = new Date();

  const goToPreviousMonth = () => {
    setDate(subMonths(date, 1));
  };

  const goToNextMonth = () => {
    setDate(addMonths(date, 1));
  };

  const goToPreviousYear = () => {
    setDate(subYears(date, 1));
  };

  const goToNextYear = () => {
    setDate(addYears(date, 1));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const selectMonth = (month) => {
    setDate(new Date(date.getFullYear(), month, 1));
    setIsExpanded(false);
  };

  const renderCollapsedView = () => (
    <div className="calendar-header">
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPreviousMonth();
        }}
        className="nav-button"
      >
        <span className="calendar-nav-arrow">&#9664;</span>
      </button>
      <h2 onClick={toggleExpand}>{format(date, "MMMM yyyy")}</h2>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNextMonth();
        }}
        className="nav-button"
      >
        <span className="calendar-nav-arrow">&#9654;</span>
      </button>
    </div>
  );

  const renderExpandedView = () => (
    <div className="expanded-calendar-overlay">
      <div className="calendar-header">
        <button onClick={goToPreviousYear} className="nav-button">
          <span className="calendar-nav-arrow">&#9664;</span>
        </button>
        <h2 onClick={toggleExpand}>{format(date, "yyyy")}</h2>
        <button onClick={goToNextYear} className="nav-button">
          <span className="calendar-nav-arrow">&#9654;</span>
        </button>
      </div>
      <div className="month-grid">
        {Array.from({ length: 12 }, (_, i) => {
          const monthDate = new Date(date.getFullYear(), i, 1);
          const isCurrentMonth = i === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
          const isSelectedMonth = i === date.getMonth();

          let className = "month-button";
          if (isCurrentMonth) className += " current-month";
          if (isSelectedMonth) className += " selected-month";

          return (
            <button key={i} onClick={() => selectMonth(i)} className={className}>
              {format(monthDate, "MMM")}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`custom-calendar ${isExpanded ? "expanded" : ""}`}>
      {renderCollapsedView()}
      {isExpanded && renderExpandedView()}
    </div>
  );
};

export default MonthlyCalendar;
