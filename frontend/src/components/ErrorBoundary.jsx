const ErrorFallback = ({ error }) => {
  return (
    <div className="error-container">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
};
export default ErrorFallback;
