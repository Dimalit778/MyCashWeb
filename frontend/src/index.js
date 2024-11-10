import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "App";
import { persistor, store } from "services/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import Toaster from "components/ui/Toaster";

const root = createRoot(document.getElementById("root"));

root.render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </PersistGate>
);
