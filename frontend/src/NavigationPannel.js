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
      .get(`${process.env.REACT_APP_API_BASE_URL}/user`, {
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
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            className="menu menu-sm dropdown-content bg-primary rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
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
        <img
          src="https://res.cloudinary.com/drhmsjhpq/image/upload/v1738520194/Asset_4_c450zr.png"
          className="h-8 ml-6"
        />
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
      <div className="navbar-end  lg:flex">
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
                <ul className="bg-primary rounded-t-none p-2 z-10 ">
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
