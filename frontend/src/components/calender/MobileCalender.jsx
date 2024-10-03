import React from "react";
import { format, addMonths, subMonths } from "date-fns";

import "./mobileCalender.css";
const MobileCalendar = ({ onChange, date }) => {
  const goToPreviousMonth = () => {
    onChange((prevDate) => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    onChange((prevDate) => addMonths(prevDate, 1));
  };

  return (
    <div className="swipeable-calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="nav-button">
          <span className="calendar-nav-arrow">&#9664;</span>
        </button>
        <h2>{format(date, "MMMM yyyy")}</h2>
        <button onClick={goToNextMonth} className="nav-button">
          <span className="calendar-nav-arrow">&#9654;</span>
        </button>
      </div>
      {/* You can add a day grid here if needed */}
    </div>
  );
};

export default MobileCalendar;
