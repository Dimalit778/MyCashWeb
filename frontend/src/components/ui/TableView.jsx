import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Delete } from "@mui/icons-material";
import "./ui.css";
import { numberFormat } from "hooks/numberFormat";

import EditForm from "./EditForm";

const Row = ({ item, type, index }) => {
  const [open, setOpen] = useState(false);
  const { _id, title, category, amount, date } = item;

  const handleDelete = () => {
    console.log("delete ", _id, type);
  };
  return (
    <>
      <TableRow className="bg-dark">
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{index}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>{numberFormat(amount)}</TableCell>
        <TableCell>{category}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" className="table table-dark">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                      <EditForm item={item} actionType={type} />
                      <IconButton onClick={handleDelete} className="text-danger">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TableView = ({ list, type }) => {
  return (
    <TableContainer component={Paper} className="bg-dark text-light">
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
            <Row key={item._id} item={item} index={index + 1} type={type} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
