const LoadingOverlay = ({ show, children }) => (
  <div className="position-relative">
    {show && (
      <div
        className="position-absolute w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
        style={{ zIndex: 1 }}
      >
        <div className="spinner-border text-primary" />
      </div>
    )}
    {children}
  </div>
);

export default LoadingOverlay;
