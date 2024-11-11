import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "components/icon";
import React, { useMemo, useState } from "react";
import PaginationPages from "./PaginationPages";
import MyButton from "components/button";

import CountUp from "react-countup";
import { useTransactionContext } from "pages/transactions/context/TransactionProvider";
import Loader from "components/loader/Loader";

import Swal from "sweetalert2";
import { THEME } from "constants/Theme";

const ITEMS_PER_PAGE = 5;

const TransactionsTable = () => {
  const { data, isLoading, type, openAddModal, openEditModal, handleDelete } = useTransactionContext();
  const [currentPage, setCurrentPage] = useState(1);

  const { allData, totalAmount } = data;

  const totalPages = Math.ceil(allData.length / ITEMS_PER_PAGE);
  const colors = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allData, currentPage]);

  const deleteAlert = (id) => {
    Swal.fire({
      title: `Delete ${type}?`,
      icon: "warning",
      showCancelButton: true,

      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  if (isLoading) return <Loader />;

  return (
    <div className="card bg-dark" style={{ minHeight: "40vh" }}>
      <div className="card-body ">
        <div className="d-flex justify-content-between align-items-center ">
          <MyButton bgColor={THEME.orange} onClick={openAddModal}>
            Add {type}
          </MyButton>
          <div className="d-flex align-items-center ">
            <h3 className="me-3 text-secondary"> Total :</h3>
            <h3 className="text-secondary">
              <CountUp start={0} end={totalAmount} separator="," prefix="$" duration={2.5} />{" "}
            </h3>
          </div>
        </div>
        <div className="border border-1 border-secondary my-3"></div>
        <div className="table-responsive  ">
          {!currentItems.length ? (
            <div className=" d-flex justify-content-center mt-5 ">
              <h3 className="text-white">{type} List is empty</h3>
            </div>
          ) : (
            <table className="table table-dark table-hover">
              <thead className="table-header-grey">
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>${item.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge bg-${colors[index % colors.length]}`}>{item.category}</span>
                    </td>
                    <td>{item.description}</td>
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
                          onClick={() => deleteAlert(item._id)}
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
