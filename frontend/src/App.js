import React, { useContext, useEffect, useState } from "react";
import { LandingPage } from "./Pages/LandingPage";
import PosterEditor from "./Pages/PosterEditor";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/login";
import SignupPage from "./Pages/signup";
import { AuthContext } from "./context/authContext";
import RefreshHandler from "./refreshHandler";
const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  function PrivateRoute({ element }) {
    return isAuthenticated ? <Navigate to="/home" /> : element;
  }
  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<PrivateRoute element={<Login />} />} />
        <Route
          path="/signup"
          element={<PrivateRoute element={<SignupPage />} />}
        />
      </Routes>
    </>
  );
};

export default App;
