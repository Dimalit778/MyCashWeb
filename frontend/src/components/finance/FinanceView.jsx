import React, { lazy, Suspense, useCallback, useState, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CustomCalendar from "components/calender/CustomCalendar";
import FinanceSkeleton from "components/loader/FinanceSkeleton";
import { useGetCategoriesQuery } from "api/slicesApi/userApiSlice";
import TransactionForm from "components/table/TransactionFormModal";
import { useAddTransactionMutation, useUpdateTransactionMutation } from "api/slicesApi/transactionsApiSlice";
import ErrorBoundary from "components/ErrorBoundary";

const PieActiveArc = lazy(() => import("components/charts/PieActiveArc"));
const DynamicProgressBars = lazy(() => import("components/charts/DynamicProgressBar"));
const Table = lazy(() => import("components/table/Table"));

const FinanceView = ({ type, date, onDateChange, data, isLoading, error }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { data: allCategories } = useGetCategoriesQuery();

  const categories = useMemo(
    () => (allCategories ? (type === "Income" ? allCategories.incomes : allCategories.expenses) : []),
    [allCategories, type]
  );

  const openAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddModalOpen(false), []);
  const openEditModal = useCallback((item) => setEditingItem(item), []);
  const closeEditModal = useCallback(() => setEditingItem(null), []);

  if (isLoading) return <FinanceSkeleton />;
  if (error)
    return (
      <div className="text-danger">
        Error loading {type}s: {error.message}
      </div>
    );

  const { sortByCategory, allData, totalAmount } = data || {};

  return (
    <Container fluid>
      <Row className="g-3" style={{ minHeight: "70vh" }}>
        <Col sm={12} lg={6}>
          <CustomCalendar date={date} onChange={onDateChange} />
          <ErrorBoundary fallback={<div>Error loading progress bars</div>}>
            <Suspense fallback={<div>Loading progress bars...</div>}>
              <DynamicProgressBars categories={sortByCategory} />
            </Suspense>
          </ErrorBoundary>
        </Col>
        <Col sm={12} lg={6} className="d-flex justify-content-center">
          <ErrorBoundary fallback={<div>Error loading pie chart</div>}>
            <Suspense fallback={<div>Loading pie chart...</div>}>
              <PieActiveArc list={sortByCategory} />
            </Suspense>
          </ErrorBoundary>
        </Col>
      </Row>
      <Row className="mt-3 px-2">
        <ErrorBoundary fallback={<div>Error loading transactions table</div>}>
          <Suspense fallback={<div>Loading transactions...</div>}>
            <Table
              list={allData}
              type={type}
              totalAmount={totalAmount}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
            />
          </Suspense>
        </ErrorBoundary>
      </Row>
    </Container>
  );
};

export default React.memo(FinanceView);
