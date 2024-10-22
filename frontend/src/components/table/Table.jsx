import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "components/custom/IconButton";
import React, { useMemo, useState } from "react";
import PaginationPages from "./Pagination";
import MyButton from "components/custom/MyButton";
import { Theme } from "constants/colors";
import { useDeleteTransactionMutation } from "api/slicesApi/transactionsApiSlice";
import CountUp from "react-countup";
import { useTransactionPageContext } from "components/transactions/TransactionPage";

const ITEMS_PER_PAGE = 5;

export default function Table({ list, type, totalAmount }) {
  const { openAddModal, openEditModal, handleDelete } = useTransactionPageContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTransaction] = useDeleteTransactionMutation();

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [list, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const onDelete = async (id) => {
    try {
      await deleteTransaction({ id, type });
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };
  return (
    <div className="card bg-dark ">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3 ">
          <MyButton bgColor={Theme.orange} onClick={openAddModal}>
            Add {type}
          </MyButton>
          <div className="d-flex align-items-center ">
            <h3 className="me-3 text-secondary"> Total :</h3>
            <h3 className="text-secondary">
              <CountUp start={0} end={totalAmount} separator="," prefix="$" duration={2.5} />{" "}
            </h3>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead className="table-header-grey">
              <tr>
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
                  {/* <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td> */}
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
                        onClick={() => openEditModal(item)}
                      />

                      <IconButton
                        icon={<FontAwesomeIcon icon={faXmark} />}
                        color="white"
                        bgColor="red"
                        onClick={() => handleDelete(item._id)}
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
