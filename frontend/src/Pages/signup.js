import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [info, setInfo] = useState({
    username: "",
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
        url: "http://localhost:8080/auth/signup",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-300 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              onChange={handlechange}
              id="username"
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={handlechange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={handlechange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            // onSubmit={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Sign Up
          </button>
          <div className="text-white">
            <span>Already have and account! </span>
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
