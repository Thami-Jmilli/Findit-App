import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import appStore from "./utils/appStore";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={appStore}>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </BrowserRouter>
  </Provider>
);
