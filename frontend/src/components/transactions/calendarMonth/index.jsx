import React, { useState } from "react";
import { format, addMonths, subMonths, addYears, subYears } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import "./calendarStyle.css";
import { monthItemVariants, overlayVariants } from "./animation";

const CalendarMonth = ({ date, setDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrevMonth = () => setDate(subMonths(date, 1));
  const handleNextMonth = () => setDate(addMonths(date, 1));
  const handlePrevYear = () => setDate(subYears(date, 1));
  const handleNextYear = () => setDate(addYears(date, 1));

  const handleMonthSelect = (month) => {
    setDate(new Date(date.getFullYear(), month, 1));
    setIsExpanded(false);
  };

  return (
    <div className="calendar-container">
      <motion.div className="calendar-header">
        <motion.button
          className="nav-button"
          onClick={() => (!isExpanded ? handlePrevMonth() : handlePrevYear())}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="calendar-nav-arrow">&#9664;</span>
        </motion.button>

        <motion.h2
          onClick={() => setIsExpanded(!isExpanded)}
          className="calendar-title"
          dataCy="month-calendar-title"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {format(date, isExpanded ? "yyyy" : "MMMM yyyy")}
        </motion.h2>

        <motion.button
          className="nav-button"
          onClick={() => (!isExpanded ? handleNextMonth() : handleNextYear())}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="nav-arrow">&#9654;</span>
        </motion.button>
      </motion.div>

      {/* Months Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="months-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div className="months-grid">
              {Array.from({ length: 12 }, (_, i) => {
                const monthDate = new Date(date.getFullYear(), i, 1);
                const isCurrentMonth = i === date.getMonth();
                const isSelectedMonth = i === date.getMonth();

                return (
                  <motion.button
                    key={i}
                    variants={monthItemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`month-button ${isCurrentMonth ? "current" : ""} ${isSelectedMonth ? "selected" : ""}`}
                    onClick={() => handleMonthSelect(i)}
                  >
                    {format(monthDate, "MMM")}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CalendarMonth;
