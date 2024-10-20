import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";
import AddForm from "components/table/AddForm";
import { Col, Container, Modal, Row } from "react-bootstrap";
import CustomCalendar from "components/calender/CustomCalendar";
import { format } from "date-fns";
import { useGetMonthlyTransactionsQuery } from "api/slicesApi/transactionsApiSlice";
import FinanceSkeleton from "components/loader/FinanceSkeleton";

const PieActiveArc = lazy(() => import("components/charts/PieActiveArc"));
const DynamicProgressBars = lazy(() => import("components/charts/DynamicProgressBar"));
const Table = lazy(() => import("components/table/Table"));

const FinanceView = ({ type }) => {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChange = useCallback((newDate) => setDate(newDate), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const formattedDate = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

  const { data: allTransactions, isLoading, error } = useGetMonthlyTransactionsQuery({ date: formattedDate, type });

  if (isLoading) return <FinanceSkeleton />;
  if (error) return <div className="text-danger">Error loading {type}s!</div>;

  const { sortByCategory, allData, totalAmount } = allTransactions;

  return (
    <Container fluid>
      <Row className="g-3 " style={{ minHeight: "70vh" }}>
        <Col sm={12} lg={6} className=" ">
          <CustomCalendar date={date} onChange={onChange} />
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicProgressBars categories={sortByCategory} />
          </Suspense>
        </Col>
        <Col sm={12} lg={6} className="d-flex justify-content-center ">
          <Suspense fallback={<div>Loading...</div>}>
            <PieActiveArc list={sortByCategory} />
          </Suspense>
        </Col>
      </Row>
      <Row className="mt-3 px-2 ">
        <Suspense fallback={<div>Loading...</div>}>
          <Table list={allData} type={type} totalAmount={totalAmount} openModal={openModal} />
        </Suspense>
      </Row>

      <Modal show={isModalOpen} onHide={closeModal} contentClassName="bg-dark">
        <Modal.Header closeButton closeVariant="white" className="border-secondary ">
          <Modal.Title className="text-center">Add {type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddForm type={type} date={date} closeModal={closeModal} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FinanceView;
