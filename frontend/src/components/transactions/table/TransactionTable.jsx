import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { openTransactionModal } from "services/reducers/uiSlice";
import { ITEMS_PER_PAGE, TABLE_COLORS } from "config/transactionsConfig";

import { format } from "date-fns";
import TableHeader from "./TableHeader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import TableTitles from "./TableTitles";
import { useDeleteTransactionMutation } from "services/api/transactionsApi";

import PaginationPages from "../pagination";

const TransactionsTable = ({ transactions, total, type }) => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteTransaction] = useDeleteTransactionMutation();

  // Sorting By Date and Amount
  const filteredAndSortedItems = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      } else if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [transactions, sortConfig]);

  // Items Per Page
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedItems, currentPage]);

  // Pagination Page Number
  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);

  // Category Color
  const categoryColorMap = useMemo(() => {
    const colorMap = new Map();
    let colorIndex = 0;

    currentItems.forEach((item) => {
      if (!colorMap.has(item.category.name)) {
        colorMap.set(item.category.name, TABLE_COLORS[colorIndex % TABLE_COLORS.length]);
        colorIndex++;
      }
    });

    return colorMap;
  }, [currentItems]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenModal = useCallback(
    (action, item = null) => {
      console.log(action, item);
      if (action === "add") {
        dispatch(openTransactionModal({ type: "add", isOpen: true }));
      } else if (action === "edit" && item) {
        dispatch(
          openTransactionModal({
            type: "edit",
            editItem: item,
            isOpen: true,
          })
        );
      }
    },
    [dispatch]
  );
  const handleExport = useCallback(() => {
    const csvContent = transactions
      .map((item) => [item.name, item.amount, item.category, format(new Date(item.date), "yyyy-MM-dd")].join(","))
      .join("\n");

    const blob = new Blob([`Name,Amount,Category,Date\n${csvContent}`], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_transactions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [transactions, type]);

  const toggleSelection = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleDelete = async (ids) => {
    const isBulk = Array.isArray(selectedItems) && ids.length > 1;

    try {
      const { isConfirmed } = await Swal.fire({
        title: isBulk ? `Delete ${ids.length} items?` : `Delete ${type}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: isBulk ? "Delete All" : "Delete",
      });

      if (!isConfirmed) return;

      if (isBulk) {
        await Promise.all(ids.map((id) => deleteTransaction({ id, type }).unwrap()));
        setSelectedItems([]);
        toast.success(`Deleted ${ids.length} items`);
      } else {
        await deleteTransaction({ id: ids[0], type }).unwrap();
        setSelectedItems([]);
        toast.success("Transaction deleted");
      }
    } catch (error) {
      toast.error(isBulk ? "Failed to delete items" : "Failed to delete transaction");
    }
  };
  const handleDeleteItems = () => handleDelete(selectedItems);

  return (
    <div className="card bg-dark mt-5" style={{ minHeight: "40vh" }}>
      <div className="card-body">
        <TableHeader type={type} total={total} exportData={handleExport} openModal={handleOpenModal} />

        <div className="table-responsive">
          {!transactions.length ? (
            <div className="d-flex justify-content-center mt-5">
              <h3 className="text-secondary">{type} List is empty</h3>
            </div>
          ) : (
            <table data-cy="transactions-table" className="table table-dark table-hover ">
              <TableTitles
                selectedItems={selectedItems}
                onDelete={handleDeleteItems}
                handleSort={handleSort}
                sortConfig={sortConfig}
              />
              <tbody data-cy="transactions-body">
                {currentItems.map((item) => (
                  <tr
                    data-cy="transactions-row"
                    key={item._id}
                    onClick={() => handleOpenModal("edit", item)}
                    className="align-middle text-center"
                  >
                    <td style={{ width: "20%", minWidth: "120px", textAlign: "left" }}>{item.name}</td>

                    <td style={{ minWidth: "100px" }}>${item.amount.toLocaleString()}</td>
                    <td style={{ minWidth: "120px" }}>
                      <div className="d-flex justify-content-center">
                        <span
                          className={`badge bg-${categoryColorMap.get(item.category.name)}`}
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.85rem",
                            width: "auto",
                            minWidth: "90px",
                            display: "inline-block",
                            textTransform: "capitalize",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.category.name}
                        </span>
                      </div>
                    </td>

                    <td style={{ minWidth: "120px" }}>{format(new Date(item.date), "MMM dd, yyyy")}</td>
                    <td
                      className="text-center"
                      onClick={(e) => e.stopPropagation()}
                      style={{ minWidth: "80px" }} // Minimum width for checkbox
                    >
                      <div className="form-check d-flex justify-content-center">
                        <input
                          className="form-check-input bg-secondary"
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleSelection(item._id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            cursor: "pointer",
                            width: "1.2rem",
                            height: "1.2rem",
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <PaginationPages currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
