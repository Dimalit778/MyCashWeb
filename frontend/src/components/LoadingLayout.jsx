const LoadingOverlay = ({ show, children }) => {
  return (
    <div className="position-relative">
      {show && (
        <div
          data-cy="loading-overlay"
          className="position-absolute w-100 h-100 bg-black bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1 }}
        >
          <div data-cy="spinner" className="spinner-border text-light " style={{ width: "4rem", height: "4rem" }} />
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingOverlay;
