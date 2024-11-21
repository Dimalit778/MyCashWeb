import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "components/ui/icon";
import React from "react";

const YearCalender = ({ year, setYear }) => {
  return (
    <div className="d-flex pt-2 justify-content-center align-items-center ">
      <IconButton
        icon={<FontAwesomeIcon icon={faAngleLeft} />}
        onClick={() => setYear((prev) => prev - 1)}
        className="border-1 border-light btn-sm me-5 bg-transparent"
      />
      <h1 className=" mb-0" style={{ fontSize: "3rem", fontFamily: "cursive", fontWeight: "bold", color: "white" }}>
        {year}
      </h1>
      <IconButton
        icon={<FontAwesomeIcon icon={faAngleRight} />}
        onClick={() => setYear((prev) => prev + 1)}
        className="border-1 border-light btn-sm ms-5 bg-transparent"
      />
    </div>
  );
};

export default YearCalender;
