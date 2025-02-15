import React, { useContext, useEffect, useState } from "react";
import { LandingPage } from "./Pages/LandingPage";
import { PosterEditor } from "./Pages/PosterEditor";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/login";
import SignupPage from "./Pages/signup";
import { AuthContext } from "./context/authContext";
import RefreshHandler from "./refreshHandler";
import { PosterPage } from "./Pages/Posterpage";
import DesignerSignup from "./Pages/DesignerSignupPage";
import { YourDesignsPage } from "./Pages/YourDesignsPage";
import UploadPage from "./Pages/PosterUploadPage";
import MyEdits from "./Pages/MyEdits";
import CartItem from "./Pages/Cart.js";
import AllPoster from "./Pages/AllPoster.js";
import Success from "./Pages/Success.js";
import Failed from "./Pages/Failed.js";

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  function LoginandSignupRoute({ element }) {
    return isAuthenticated ? <Navigate to="/home" /> : element;
  }
  function RedirecttoLogin({ element }) {
    return isAuthenticated ? element : <Navigate to="/login" />;
  }
  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />
        <Route
          path="/login"
          element={<LoginandSignupRoute te element={<Login />} />}
        />
        <Route
          path="/signup"
          element={<LoginandSignupRoute element={<SignupPage />} />}
        />
        <Route path="/poster/:id" element={<PosterPage />} />
        <Route path="/Contact" element={<DesignerSignup />} />
        <Route path="/home/yourdesign" element={<YourDesignsPage />} />
        <Route path="/home/yourdesign/upload" element={<UploadPage />} />
        <Route path="/home/yourdesign/upload/:id" element={<PosterEditor />} />
        <Route path="/home/myedits" element={<MyEdits />} />
        <Route path="/cart" element={<CartItem />} />
        <Route path="/posters" element={<AllPoster />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failed" element={<Failed />} />
        <Route
          path="/editor/:id"
          element={
            // <RedirecttoLogin element={
            <PosterEditor />
            // } />
          }
        />
      </Routes>
    </>
  );
};

export default App;
