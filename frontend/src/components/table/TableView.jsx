import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useDeleteTransactionMutation } from "api/slicesApi/transactionsApiSlice";
import Row from "./Row";
import MyButton from "components/custom/MyButton";
import CountUp from "react-countup";

const TableView = ({ list, type, totalAmount, openModal }) => {
  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleDelete = async (id) => {
    try {
      await deleteTransaction({ id, type });
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  return (
    <TableContainer component={Paper} className="bg-dark text-light">
      <div className="d-flex justify-content-evenly align-items-center p-2 ">
        <MyButton onClick={openModal} bgColor="grey" color="black">
          Add {type}
        </MyButton>
        <h5 className="text-light">
          Total {type}: <CountUp start={0} end={totalAmount} separator="," prefix="$" duration={2.5} />
        </h5>
      </div>
      <Table className="table table-dark table-striped">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>No.</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item, index) => (
            <Row key={item._id} item={item} index={index + 1} type={type} handleDelete={handleDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
