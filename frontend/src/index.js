import React from "react";
import App from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
