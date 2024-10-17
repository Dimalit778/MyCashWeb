import React, { useState } from "react";
import { TableCell, TableRow, Collapse, IconButton, Box, Table, TableBody, TableHead } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Delete } from "@mui/icons-material";
import { numberFormat } from "hooks/numberFormat";
import EditForm from "components/table/EditForm";

const Row = ({ item, type, index, handleDelete }) => {
  const [open, setOpen] = useState(false);
  const { _id, title, category, amount, date } = item;

  const onDelete = async () => {
    console.log("delete ", _id, type);
    await handleDelete(_id);
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
                      <IconButton onClick={onDelete} className="text-danger">
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

export default Row;
