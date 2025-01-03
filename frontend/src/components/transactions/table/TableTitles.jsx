import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import MyButton from "components/ui/button";
const TableTitles = ({ selectedItems, onDelete, handleSort, sortConfig, dataCy }) => {
  const headers = [
    { key: "label", label: "Name", sortable: false, width: "30%", align: "left" },
    { key: "amount", label: "Amount", sortable: true, width: "20%", align: "center" },
    { key: "category", label: "Category", sortable: false, width: "20%", align: "center" },
    { key: "date", label: "Date", sortable: true, width: "20%", align: "center" },
    {
      key: "select",
      label: (
        <div className="d-flex align-items-center justify-content-center h-100" style={{ minWidth: "100px" }}>
          <MyButton
            onClick={onDelete}
            disabled={selectedItems.length === 0}
            bgColor={selectedItems.length > 0 ? "red" : "transparent"}
          >
            Delete
            <span className="ms-1">{selectedItems.length > 0 && `(${selectedItems.length})`}</span>
          </MyButton>
        </div>
      ),
      sortable: false,
      width: "10%",
      align: "center",
    },
  ];

  return (
    <thead data-cy="table-titles" className="table-header-grey">
      <tr>
        {headers.map(({ key, label, sortable = true, width, align }) => (
          <th
            key={key}
            onClick={() => sortable && handleSort(key)}
            style={{
              cursor: sortable ? "pointer" : "default",
              width: width,
              minWidth: key === "label" ? "150px" : "100px",
              textAlign: align,
              verticalAlign: "middle",
            }}
          >
            <div
              className={`d-flex align-items-center gap-2 h-100 ${align === "center" ? "justify-content-center" : ""}`}
            >
              {label}
              {sortable && (
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
  );
};
export default TableTitles;
