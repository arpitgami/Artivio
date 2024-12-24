import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/authContext";

export function NavigationPannel() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsAuthenticated(false);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="text-xl font-bold">Logo</div>

      <div className="hidden sm:flex space-x-4">
        <Link className="text-gray-700 hover:text-blue-500" to="/home">
          Home
        </Link>
      </div>

      <div className="flex items-center space-x-4">
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
