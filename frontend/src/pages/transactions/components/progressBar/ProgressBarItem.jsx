import React from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "react-bootstrap";
import CountUp from "react-countup";

const ProgressBarItem = React.memo(({ category, total, percentage, index }) => {
  const colors = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="position-relative mt-3">
        <ProgressBar now={percentage} className="custom-progress bg-dark" variant={colors[index % colors.length]} />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center px-2">
          <div className="d-flex justify-content-between align-items-center w-100 text-style">
            <span className="text-capitalize fw-bold">{category}</span>
            <span>
              <CountUp start={0} end={total} separator="," decimals={2} prefix="$" duration={1.5} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ProgressBarItem;
