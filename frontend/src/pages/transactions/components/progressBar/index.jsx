import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { AnimatePresence } from "framer-motion";
import "./progressBar.css";
import ProgressBarItem from "./ProgressBarItem";

const DynamicProgressBars = ({ data, totalSum }) => {
  const processedData = useMemo(() => {
    if (!data?.length || !totalSum) return [];

    return data.map((item) => ({
      category: item.category,
      total: item.total,
      percentage: (item.total / totalSum) * 100,
    }));
  }, [data, totalSum]);

  const shouldUseGrid = data.length > 5;

  return (
    <div className="progress-container">
      <AnimatePresence>
        {shouldUseGrid ? (
          <Row className="">
            {processedData.map((item, index) => (
              <Col xs={12} md={6} key={item.category}>
                <ProgressBarItem
                  category={item.category}
                  total={item.total}
                  percentage={item.percentage}
                  index={index}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="single-column">
            {processedData.map((item, index) => (
              <ProgressBarItem
                key={item.category}
                category={item.category}
                total={item.total}
                percentage={item.percentage}
                index={index}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(DynamicProgressBars);
