import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <BootstrapPagination>
      {pageNumbers.map((number) => (
        <BootstrapPagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </BootstrapPagination.Item>
      ))}
    </BootstrapPagination>
  );
};

export default Pagination;
