import React, { startTransition } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "App";
import { persistor, store } from "services/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Toaster } from "react-hot-toast";

import { ErrorBoundary } from "components/ErrorBoundary";

const root = createRoot(document.getElementById("root"));

startTransition(() => {
  root.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ErrorBoundary>
          <App />
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
});
