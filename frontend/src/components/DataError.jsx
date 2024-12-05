const DataError = ({ error }) => {
  return (
    <div className="container-fluid mt-5 d-flex flex-column justify-content-center align-items-center gap-3 ">
      <span>Something went wrong...</span>
      <span className="text-danger ">{error.data.message}</span>
    </div>
  );
};
export default DataError;
