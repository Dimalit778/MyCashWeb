import React from "react";
import { Pagination } from "react-bootstrap";

import styled from "styled-components";

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
    <StyledPagination size="sm" className="justify-content-center pagination-dark mt-3 mb-0">
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
      {pageItems}
      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
    </StyledPagination>
  );
};

export default PaginationPages;

const StyledPagination = styled(Pagination)`
  &.pagination-dark {
    .page-item .page-link {
      background-color: #343a40;
      border-color: #454d55;
      color: #fff;
    }

    .page-item.active .page-link {
      background: var(--light-grey);
      border-color: #454d55;
      color: #fff;
      font-weight: bold;
    }

    .page-item.disabled .page-link {
      background-color: #343a40;
      border-color: #454d55;
      color: #6c757d;
    }

    .page-link:hover {
      background-color: #23272b;
      border-color: #454d55;
      color: #fff;
    }

    .page-link:focus {
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
`;
