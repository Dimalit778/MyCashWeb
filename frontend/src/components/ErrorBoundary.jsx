import MyButton from "components/ui/button";
import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="container-fluid vh-100 bg-dark d-flex flex-column justify-content-center align-items-center gap-3">
      <h2>Something went wrong!</h2>
      <pre>{error.message}</pre>
      <MyButton onClick={resetErrorBoundary}>Try again</MyButton>
    </div>
  );
};

export const ErrorBoundary = ({ children }) => {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
};
