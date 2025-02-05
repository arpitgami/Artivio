import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <BrowserRouter>
        <NextUIProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NextUIProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
