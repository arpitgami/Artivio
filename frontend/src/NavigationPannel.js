import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import axios from "axios";

export function NavigationPannel() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isdesigner, setIsDesigner] = useState(false);
  const [userid, setUserid] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.isdesigner) {
          setIsDesigner(true);
          setUserid(res.data.id);
        }
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsAuthenticated(false);
    navigate("/home");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="text-xl font-bold">Logo</div>

      <div className="hidden sm:flex space-x-4">
        <Link className="text-gray-700 hover:text-blue-500" to="/home">
          Home
        </Link>

        {isdesigner && (
          <Link
            className="text-gray-700 hover:text-blue-500"
            to="/home/yourdesign"
          >
            My Designs
          </Link>
        )}
        {!isdesigner && (
          <Link className="text-gray-700 hover:text-blue-500" to="/contact">
            Contact
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isdesigner && (
          <Link
            className="text-gray-700 hover:text-blue-500"
            to="/home/yourdesign/upload"
          >
            Upload
          </Link>
        )}
        {!isAuthenticated ? (
          <>
            <Link className="text-gray-700 hover:text-blue-500" to="/login">
              Login
            </Link>
            <Link
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              to="/signup"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
