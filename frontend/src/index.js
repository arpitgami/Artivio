import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./context/authContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NextUIProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NextUIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
