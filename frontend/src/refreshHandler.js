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
        res.data.success ? setIsAuthenticated(true) : setIsAuthenticated(false);
      });
  }, [location, navigate, setIsAuthenticated]);

  return null;
}

export default RefreshHandler;
