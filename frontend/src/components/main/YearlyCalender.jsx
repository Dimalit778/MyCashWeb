import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "components/custom/IconButton";
import React from "react";

export default function YearlyCalender({ year, setYear }) {
  return (
    <div className="d-flex justify-content-center align-items-center bg-primary  ">
      <IconButton
        icon={<FontAwesomeIcon icon={faAngleLeft} />}
        onClick={() => setYear((prev) => prev - 1)}
        className="border-1 border-light btn-sm me-4 bg-transparent"
      />
      <h1 className="text-light"> {year}</h1>
      <IconButton
        icon={<FontAwesomeIcon icon={faAngleRight} />}
        onClick={() => setYear((prev) => prev + 1)}
        className="border-1 border-light btn-sm ms-4 bg-transparent"
      />
    </div>
  );
}
