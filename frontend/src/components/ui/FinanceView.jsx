import React, { useCallback, useMemo, useState } from "react";

import PieActiveArc from "components/charts/PieActiveArc";
import Loader from "components/custom/Loader";
import AddForm from "components/ui/AddForm";
import { Col, Container, Modal, Row } from "react-bootstrap";
import CustomCalendar from "components/calender/CustomCalendar";
import { format } from "date-fns";
import { useGetMonthlyTransactionsQuery } from "api/slicesApi/transactionsApiSlice";
import MyButton from "components/custom/MyButton";
import TableView from "./TableView";

const FinanceView = ({ type }) => {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChange = useCallback((newDate) => setDate(newDate), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const formattedDate = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

  const { data: allTransactions, isLoading, error } = useGetMonthlyTransactionsQuery({ date: formattedDate, type });

  if (isLoading) return <Loader />;
  if (error) return <div className="text-danger">Error loading {type}s!</div>;

  const { sortByCategory, allData, totalAmount } = allTransactions;

  return (
    <Container fluid className=" text-light  ">
      <Row className="g-3 ">
        <Col className="col-12 col-lg-6 d-flex">
          <div className=" w-100 ">
            <div className="d-flex flex-column ">
              <CustomCalendar date={date} onChange={onChange} />
            </div>
            <div className="card-body d-flex flex-column mt-4 gap-3">
              {/* <CustomProgressBar list={categoryTotals} date={date} /> */}
            </div>
          </div>
        </Col>
        <div className="col-12 col-lg-6 d-flex">
          <div className="  w-100">
            <div className="card-body d-flex flex-column">
              <div className="">
                <PieActiveArc list={sortByCategory} />
                {/* <FinanceBarChart list={sortByCategory} /> */}
              </div>
            </div>
          </div>
        </div>
      </Row>
      <Row className="mt-3 ">
        <div className="card p-0 bg-dark">
          <div className="d-flex justify-content-evenly align-items-center p-2 ">
            <MyButton onClick={openModal} bgColor="grey" color="black">
              Add {type}
            </MyButton>
            <h5 className="text-light">
              Total {type}: {totalAmount}
            </h5>
          </div>
          <TableView list={allData} type={type} />
        </div>
      </Row>

      <Modal show={isModalOpen} onHide={closeModal} contentClassName="bg-dark">
        <Modal.Header closeButton closeVariant="white" className="border-secondary ">
          <Modal.Title className="text-center">Add {type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddForm type={type} date={date} onClose={closeModal} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FinanceView;
