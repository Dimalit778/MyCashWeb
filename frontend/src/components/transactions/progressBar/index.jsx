import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { AnimatePresence } from "framer-motion";
import "./progressBar.css";
import ProgressBarItem from "./ProgressBarItem";

const ProgressBars = ({ data, categories, total }) => {
  const shouldUseGrid = data.length > 10;

  const processedCategories = useMemo(() => {
    if (!data?.length || !total) return categories;

    return data
      .map((category) => ({
        ...category,
        percentage: ((category.total / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.total - a.total);
  }, [data, total, categories]);

  return (
    <div className="progress-container">
      <AnimatePresence>
        {shouldUseGrid ? (
          <Row>
            {processedCategories.map((item, index) => (
              <Col xs={12} md={6}>
                <ProgressBarItem
                  key={item.category.id}
                  category={item.category.name}
                  total={item.total}
                  percentage={item.percentage}
                  index={index}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="single-column">
            {processedCategories.map((item, index) => (
              <ProgressBarItem
                key={item.category.id}
                category={item.category.name}
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

export default React.memo(ProgressBars);
