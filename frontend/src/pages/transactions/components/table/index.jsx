import React, { useMemo, useState } from "react";
import PaginationPages from "../PaginationPages";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useDispatch } from "react-redux";

import { useTransactionActions } from "services/actions/useTransactionsActions";
import { openTransactionModal } from "services/reducers/uiSlice";
import { ITEMS_PER_PAGE } from "../../config/trans";
import EmptyTable from "./EmptyTable";
import Table from "./Table";
import TableHeader from "./TableHeader";
const TransactionsTable = ({ data, total, type }) => {
  const dispatch = useDispatch();
  const { handleDelete } = useTransactionActions();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const colors = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

  // Enhanced filtering and sorting
  const filteredAndSortedItems = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      } else if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      // If the sort key is not "date", "amount", "max_amount", or "min_amount", don't sort
      return 0;
    });
  }, [data, sortConfig]);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedItems, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteClick = async (id) => {
    try {
      const result = await Swal.fire({
        title: `Delete ${type}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
      });

      if (result.isConfirmed) {
        await handleDelete({ id, type }).unwrap(); // Make sure to use unwrap()
        toast.success(`${type} deleted successfully`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.data?.message || "Failed to delete transaction");
    }
  };

  const handleEdit = (item) => {
    dispatch(
      openTransactionModal({
        type: "edit",
        editingId: item._id,
        data: item,
      })
    );
  };

  const exportData = () => {
    const csv = filteredAndSortedItems
      .map((item) => {
        return `${item.name},${item.amount},${item.category},${item.description || ""},${format(
          new Date(item.date),
          "yyyy-MM-dd"
        )}`;
      })
      .join("\n");

    const blob = new Blob([`Name,Amount,Category,Description,Date\n${csv}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_transactions.csv`;
    a.click();
  };
  const openModal = () => {
    dispatch(
      openTransactionModal({
        type: "add",
      })
    );
  };

  return (
    <div className="card bg-dark" style={{ minHeight: "40vh" }}>
      <div className="card-body">
        <TableHeader type={type} total={total} exportData={exportData} openModal={openModal} />
        <div className="table-responsive">
          {!currentItems.length ? (
            <EmptyTable type={type} />
          ) : (
            <Table
              items={currentItems}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              sortConfig={sortConfig}
              handleSort={handleSort}
              colors={colors}
            />
          )}
        </div>

        {totalPages > 1 && (
          <PaginationPages currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
