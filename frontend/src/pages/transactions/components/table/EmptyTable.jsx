import React from "react";

const EmptyTable = ({ type }) => {
  return (
    <div className="d-flex justify-content-center mt-5">
      <h3 className="text-white">{type} List is empty</h3>
    </div>
  );
};

export default EmptyTable;
