import React from "react";
import Calendar from "react-calendar";
import "./calendarYearMonth.css";
const CalendarYearMonth = ({ onChange, date }) => {
  return (
    <div className="calendar-container">
      <Calendar
        maxDetail="year"
        minDetail="year"
        locale="en"
        onChange={onChange}
        value={date}
        prev2Label={null}
        next2Label={null}
        navigationLabel={({ date }) => <span className="calendar-year">{date.getFullYear()}</span>}
        tileClassName={({ date, view }) =>
          view === "year" &&
          date.getMonth() === new Date().getMonth() &&
          date.getFullYear() === new Date().getFullYear()
            ? "react-calendar__tile--now"
            : null
        }
        prevLabel={<span className="calendar-nav-arrow">&#9664;</span>}
        nextLabel={<span className="calendar-nav-arrow">&#9654;</span>}
      />
    </div>
  );
};

export default CalendarYearMonth;
