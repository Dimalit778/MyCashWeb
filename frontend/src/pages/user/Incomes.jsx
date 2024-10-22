import TransactionForm from "components/transactions/TransactionModal";
import { TransactionPageProvider } from "components/transactions/TransactionPage";
import { Calendar, ProgressBars, Chart, TransactionsTable } from "components/transactions/TransactionSubComp";
import { Col, Container, Row } from "react-bootstrap";

const Incomes = () => {
  return (
    <TransactionPageProvider type="Income">
      <Container fluid>
        <Row className="g-3" style={{ minHeight: "70vh" }}>
          <Col sm={12} lg={6}>
            <Calendar />
            <ProgressBars />
          </Col>
          <Col sm={12} lg={6} className="d-flex justify-content-center">
            <Chart />
          </Col>
        </Row>
        <Row className="mt-3 px-2">
          <Col sm={12}>
            <TransactionsTable />
          </Col>
        </Row>
      </Container>
      <TransactionForm />
    </TransactionPageProvider>
  );
};
export default Incomes;
