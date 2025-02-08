import React, { useState } from "react";
import { NavigationPannel } from "../NavigationPannel";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DesignerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isdesigner: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/designersignup`,
        formData
      );
      console.log(res.data);

      if (res.data.success) {
        alert(
          "Your request has been submitted successfully. We will get back to you soon."
        );
        navigate(`/home`);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <NavigationPannel className="" />
      <div className="flex flex-col items-center justify-center bg-white text-black">
        {/* Header Section */}
        <div className="text-center mt-24 my-8">
          <h1 className="text-3xl font-bold mb-4">Apply to join our team...</h1>
          <p className="text-lg">
            Are you a talented designer who wants to earn extra income through
            listing your artwork on our site? Sign up below.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email *"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DesignerSignup;
