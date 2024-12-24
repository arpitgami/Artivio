import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
}

export default RefreshHandler;
