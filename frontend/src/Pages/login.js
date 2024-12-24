import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handlechange(e) {
    const name = e.target.id;
    const value = e.target.value;
    const newInfo = { ...info };
    newInfo[name] = value;

    setInfo(newInfo);
    console.log(info);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:8080/auth/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(info),
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("loggedInUser", res.data.username);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              onChange={handlechange}
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              onChange={handlechange}
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-2 rounded-md hover:bg-black"
          >
            Login
          </button>
          <div className="text-black py-2">
            <span>Already have and account! </span>
            <Link to="/signup">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
