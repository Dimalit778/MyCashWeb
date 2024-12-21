const LoadingOverlay = ({ show, children, "data-cy": dataCy }) => (
  <div className="position-relative" data-cy={dataCy}>
    {show && (
      <div
        data-cy="loading-container"
        className="position-absolute w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
        style={{ zIndex: 1 }}
      >
        <div data-cy="spinner" className="spinner-border text-primary" />
      </div>
    )}
    {children}
  </div>
);

export default LoadingOverlay;
