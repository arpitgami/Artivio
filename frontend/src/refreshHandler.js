import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/checktoken", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        // console.log("userdata : ", res.data.success);
        if (res.data.success) setIsAuthenticated(true);
        else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      });
  }, [location, navigate, setIsAuthenticated]);

  return null;
}

export default RefreshHandler;
