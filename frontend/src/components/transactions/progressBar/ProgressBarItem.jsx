import React from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "react-bootstrap";
import CountUp from "react-countup";
import Capitalize from "utils/Capitalize";

const ProgressBarItem = ({ category, total, color, percentage, index }) => {
  return (
    <motion.div
      data-cy="progress-bar-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="position-relative ">
        <ProgressBar now={percentage} className="custom-progress bg-dark" variant={color} />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ">
          <div className="d-flex justify-content-between align-items-center w-100 text-style p-2">
            <span data-cy="progress-bar-title" className="text-capitalize fw-bold">
              {Capitalize(category)}
            </span>
            <span data-cy="progress-bar-total" data-total={total}>
              <CountUp start={0} end={total} separator="," decimals={2} prefix="$" duration={1.5} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressBarItem;
