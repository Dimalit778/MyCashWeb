import { faPenToSquare, faSort, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "components/icon";

import React from "react";

import { format } from "date-fns";
import { TABLE_HEADERS } from "pages/transactions/config/trans";
const Table = ({ items, colors, handleSort, sortConfig, handleEdit, handleDeleteClick }) => {
  return (
    <table className="table table-dark table-hover">
      <thead className="table-header-grey">
        <tr>
          {TABLE_HEADERS.map(({ key, label, sortable = true }) => (
            <th
              key={key}
              onClick={() => sortable && handleSort(key)}
              style={{ cursor: sortable ? "pointer" : "default" }}
            >
              <div className="d-flex align-items-center gap-2">
                {label}
                {sortable && sortConfig.key === key && (
                  <FontAwesomeIcon
                    icon={faSort}
                    className={`text-${sortConfig.direction === "asc" ? "success" : "danger"}`}
                  />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>${item.amount.toLocaleString()}</td>
            <td>
              <span className={`badge bg-${colors[index % colors.length]}`}>{item.category}</span>
            </td>
            <td>{item.description}</td>
            <td>{format(new Date(item.date), "MMM dd, yyyy")}</td>
            <td>
              <div className="d-flex gap-3">
                <IconButton
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  color="white"
                  bgColor="grey"
                  onClick={() => handleEdit(item)}
                />
                <IconButton
                  icon={<FontAwesomeIcon icon={faXmark} />}
                  color="white"
                  bgColor="red"
                  onClick={() => handleDeleteClick(item._id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default Table;
