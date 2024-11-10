import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import "styles/DynamicProgressBarStyle.css";
import { useTransactionContext } from "../context/TransactionProvider";

const ProgressBarItem = ({ category, total, index }) => {
  const percentage = total > 0 ? (category.total / total) * 100 : 0;
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
            <span className="text-capitalize fw-bold">{category._id}</span>
            <span>
              <CountUp start={0} end={category.total} separator="," decimals={2} prefix="$" duration={1.5} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
const DynamicProgressBars = () => {
  const { data, categories: userCategories, isLoading } = useTransactionContext();

  const { sortedCategories, total } = useMemo(() => {
    const existingCategories = data?.sortByCategory || [];
    const total = existingCategories.reduce((sum, category) => sum + category.total, 0);

    const categoryTotals = Object.fromEntries(existingCategories.map((cat) => [cat._id, cat.total]));

    const sortedCategories = userCategories
      .map((category) => ({
        _id: category,
        total: categoryTotals[category] || 0,
      }))
      .sort((a, b) => b.total - a.total);

    return { sortedCategories, total };
  }, [data, userCategories]);

  if (isLoading) {
    return (
      <div className="progress-skeleton">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-item">
            <div className="skeleton-header" />
            <div className="skeleton-bar" />
          </div>
        ))}
      </div>
    );
  }

  const shouldUseGrid = sortedCategories.length > 5;

  return (
    <div className="progress-container">
      <AnimatePresence>
        {shouldUseGrid ? (
          <Row className="">
            {sortedCategories.map((category, index) => (
              <Col key={category._id} xs={12} md={6}>
                <ProgressBarItem category={category} total={total} index={index} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="single-column">
            {sortedCategories.map((category, index) => (
              <ProgressBarItem key={category._id} category={category} total={total} index={index} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(DynamicProgressBars);
