import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import axios from "axios";

export function NavigationPannel() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isdesigner, setIsDesigner] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        // console.log("userdata : ", res);
        if (res.data.success) return;
        setUser(res.data);
        if (res.data.isdesigner) {
          setIsDesigner(true);
          // console.log("nav data ", res.data);
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
    <div className="navbar bg-primary text-base-100  ">
      <div className="navbar-start">
        <div className="ml-5  text-xl">Artivio</div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>{!isdesigner && <Link to="/home">Home</Link>}</li>
          <li>{!isdesigner && <Link to="/posters">Posters</Link>}</li>
          {isdesigner && (
            <li>
              <Link to="/home/yourdesign">My Designs</Link>
            </li>
          )}
          <li>{!isdesigner && <Link to="/contact">Contact</Link>}</li>
        </ul>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-8">
          {isdesigner && (
            <li>
              <Link to="/home/yourdesign/upload">Upload</Link>
            </li>
          )}
          {!isdesigner && (
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          )}
          {isAuthenticated ? (
            <li>
              <details>
                <summary className="">
                  {localStorage.getItem("loggedInUser")}
                </summary>
                <ul className="bg-black rounded-t-none p-2 ">
                  {!isdesigner && (
                    <li>
                      <Link to="/home/myedits">
                        <span className="w-16">My Edits</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <div className=" text-red-700" onClick={handleLogout}>
                      Logout
                    </div>
                  </li>
                </ul>
              </details>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
