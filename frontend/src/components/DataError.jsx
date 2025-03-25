const DataError = ({ error }) => {
  const getErrorMessage = () => {
    if (!error) return "Unknown error";

    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (error.data && error.data.message) return error.data.message;

    // Handle mocked response format from Cypress
    if (error.body && error.body.message) return error.body.message;

    return "An error occurred";
  };
  return (
    <div
      data-cy="year-error"
      className="container-fluid mt-5 d-flex flex-column justify-content-center align-items-center gap-3 "
    >
      <span>Something went wrong...</span>

      <span className="text-danger">{getErrorMessage()}</span>
    </div>
  );
};
export default DataError;
