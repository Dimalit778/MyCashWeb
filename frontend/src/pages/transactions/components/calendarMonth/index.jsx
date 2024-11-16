import React, { useState } from "react";
import { format, addMonths, subMonths, addYears, subYears } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import "./calendarStyle.css";

import { useDispatch, useSelector } from "react-redux";
import { selectedDateObject, setSelectedDate } from "services/reducers/uiSlice";
import { monthItemVariants, overlayVariants } from "./animation";

const CalendarMonth = () => {
  const dispatch = useDispatch();
  const date = useSelector(selectedDateObject);
  const [isExpanded, setIsExpanded] = useState(false);
  const currentDate = new Date();

  // Handle date changes through Redux
  const handleDateChange = (newDate) => {
    dispatch(setSelectedDate(newDate.toISOString().split("T")[0]));
  };

  const handlePrevMonth = () => handleDateChange(subMonths(date, 1));
  const handleNextMonth = () => handleDateChange(addMonths(date, 1));
  const handlePrevYear = () => handleDateChange(subYears(date, 1));
  const handleNextYear = () => handleDateChange(addYears(date, 1));

  const handleMonthSelect = (month) => {
    handleDateChange(new Date(date.getFullYear(), month, 1));
    setIsExpanded(false);
  };

  return (
    <div className="calendar-container mt-3">
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
                const isCurrentMonth = i === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
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
