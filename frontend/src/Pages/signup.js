import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Googlelogin from "../googlelogin";

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
        url: `${process.env.REACT_APP_API_BASE_URL}/auth/signup`,
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
    <div className="min-h-screen flex items-center bg-base-100 justify-center">
      <div
        className="btn btn-sm bg-base-100 text-gray-700 hover:bg-base-300 hover:text-primary btn-square px-5 text-base-100 absolute top-10 left-10 "
        onClick={() => navigate("/home")}
      >
        {`<`}
      </div>
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username :
            </label>
            <input
              type="text"
              onChange={handlechange}
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={handlechange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={handlechange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-2 rounded-md hover:bg-black"
          >
            Sign Up
          </button>
          <div className="text-black text-center mt-4">
            <span>Already have an account? </span>
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </div>
          <div className="mt-6 flex justify-center">
            <Googlelogin />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
