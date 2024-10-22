import CustomCalendar from "components/calender/CustomCalendar";
import PieActiveArc from "components/charts/PieActiveArc";
import DynamicProgressBars from "components/charts/DynamicProgressBar";
import Table from "components/table/Table";
import { useTransactionPageContext } from "./TransactionPage";

export const Calendar = () => {
  const { date, setDate } = useTransactionPageContext();
  return <CustomCalendar date={date} onChange={setDate} />;
};

export const Chart = () => {
  const { data, isLoading } = useTransactionPageContext();
  if (isLoading) return <div>Loading chart...</div>;
  return <PieActiveArc list={data?.sortByCategory || []} />;
};

export const ProgressBars = () => {
  const { data, isLoading } = useTransactionPageContext();
  if (isLoading) return <div>Loading progress bars...</div>;
  return <DynamicProgressBars categories={data?.sortByCategory || []} />;
};

export const TransactionsTable = () => {
  const { data, isLoading, type, openAddModal, openEditModal } = useTransactionPageContext();
  if (isLoading) return <div>Loading transactions...</div>;
  return (
    <Table
      list={data?.allData || []}
      type={type}
      totalAmount={data?.totalAmount || 0}
      openAddModal={openAddModal}
      openEditModal={openEditModal}
    />
  );
};
