import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "components/custom/IconButton";

import React, { useMemo, useState } from "react";
import Pagination from "./Pagination";
import PaginationPages from "./Pagination";
const ITEMS_PER_PAGE = 7;
export default function Table({ list, type, totalAmount, openModal }) {
  const onEdit = () => {};
  const onDelete = () => {};
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [list, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="card bg-dark text-light min">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-primary">Add Expense</button>
          <h5 className="mb-0">Total : ${totalAmount.toLocaleString()}</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td>{item.title}</td>
                  <td>${item.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge bg-${getCategoryColor(item.category)}`}>{item.category}</span>
                  </td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-3">
                      <IconButton
                        icon={<FontAwesomeIcon icon={faPenToSquare} />}
                        color="white"
                        bgColor="grey"
                        onClick={() => onEdit(item._id)}
                      />

                      <IconButton
                        icon={<FontAwesomeIcon icon={faXmark} />}
                        color="white"
                        bgColor="red"
                        onClick={() => onDelete(item._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationPages currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

const getCategoryColor = (category) => {
  switch (category.toLowerCase()) {
    case "new":
      return "danger";
    case "food":
      return "primary";
    case "other":
      return "warning";
    case "entertainment":
      return "info";
    default:
      return "secondary";
  }
};
