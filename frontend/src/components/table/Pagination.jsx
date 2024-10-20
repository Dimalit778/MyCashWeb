import React from "react";
import { Pagination } from "react-bootstrap";
import "./PaginationStyle.css";

const PaginationPages = ({ currentPage, totalPages, onPageChange }) => {
  const pageItems = [];

  for (let number = 1; number <= totalPages; number++) {
    if (number === 1 || number === totalPages || (number >= currentPage - 2 && number <= currentPage + 2)) {
      pageItems.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
          {number}
        </Pagination.Item>
      );
    } else if (
      (number === currentPage - 3 && currentPage > 4) ||
      (number === currentPage + 3 && currentPage < totalPages - 3)
    ) {
      pageItems.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
    }
  }

  return (
    <Pagination className="justify-content-center pagination-dark">
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
      {pageItems}
      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
    </Pagination>
  );
};
export default PaginationPages;
