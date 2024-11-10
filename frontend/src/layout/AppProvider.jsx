import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./ErrorBoundary";
import { persistor, store } from "services/store.js";
import { Helmet } from "react-helmet";

export const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <Helmet>
            <title>MyCash</title>
          </Helmet>

          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { marginTop: "5rem" },
            }}
          />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
};
