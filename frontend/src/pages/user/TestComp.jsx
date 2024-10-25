import {
  DynamicProgressBar,
  MonthlyCalendar,
  MonthlyPieChart,
  TransactionForm,
  TransactionProvider,
  TransactionsTable,
} from "components/transactions";
import { Col, Container, Row } from "react-bootstrap";

const Incomes = () => {
  return (
    <TransactionProvider type="Income">
      <Container fluid className="bg-primary">
        <Row className="g-3" style={{ minHeight: "70vh" }}>
          <Col sm={12} lg={6}>
            <MonthlyCalendar />
            <DynamicProgressBar />
          </Col>
          <Col sm={12} lg={6} className="d-flex justify-content-center">
            <MonthlyPieChart />
          </Col>
        </Row>
        <Row className="mt-3 px-2">
          <Col sm={12}>
            <TransactionsTable />
          </Col>
        </Row>
      </Container>
      <TransactionForm />
    </TransactionProvider>
  );
};
export default Incomes;
