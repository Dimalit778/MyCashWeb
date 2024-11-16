import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyButton from "components/button";
import { THEME } from "constants/Theme";
import React from "react";
import CountUp from "react-countup";

const TableHeader = ({ total, exportData, openModal, type }) => {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
      <div className="d-flex gap-2">
        <MyButton bgColor={THEME.orange} onClick={() => openModal()}>
          Add {type}
        </MyButton>
        <MyButton bgColor={THEME.grey} onClick={exportData}>
          <FontAwesomeIcon icon={faFileExport} className="me-2" />
          Export
        </MyButton>
      </div>

      <div className="d-flex align-items-center">
        <h3 className="me-3 text-secondary">Total:</h3>
        <h3 className="text-secondary">
          <CountUp start={0} end={total} separator="," prefix="$" duration={2.5} />
        </h3>
      </div>
    </div>
  );
};

export default TableHeader;
