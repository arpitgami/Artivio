import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { NavigationPannel } from "../NavigationPannel";

export function PosterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/posters/${id}`);
        setPoster(res.data[0]);
        setLoading(false);
        // console.log(res.data);
      } catch (err) {
        setError("Poster couldn't be fetched.");
        setLoading(false);
        // setTimeout(() => navigate("/home"), 2000);
      }
    };

    fetchPoster();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        {error}
      </div>
    );
  }

  async function handleCustomize() {
    const res = await axios.get("http://localhost:8080/checktoken", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    if (!res.data.success) {
      alert("Please login to customize the poster.");
      navigate("/login");
      return;
    }
    navigate(`/editor/${id}`);
  }
  async function handleaddtocart() {
    try {
      const user = await axios.get("http://localhost:8080/user", {
        headers: { Authorization: localStorage.getItem("token") },
      });

      const res = await axios.post(
        "http://localhost:8080/cart",
        {
          posterid: id,
          userid: user.data._id,
          customized: false,
          quantity: 1,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      // console.log(res.data);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <NavigationPannel />
        <div className="bg-gray-100  flex items-center justify-center h-screen">
          <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-4/5 md:w-2/3 lg:w-1/2 overflow-hidden">
            <div className="bg-gray-200 w-full md:w-1/2 flex items-center justify-center">
              <div className="relative w-full h-0 pb-[125%] bg-gray-300 rounded-lg overflow-hidden">
                <img
                  src={poster.imageURL}
                  alt={poster.posterName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {poster.posterName}
              </h2>

              <p className="text-gray-600 text-sm mb-2">
                Designed by:{" "}
                <span className="font-semibold">{poster.designersName}</span>
              </p>

              <p className="text-xl font-bold text-gray-800 mb-6">
                <span>Rs. </span>
                {poster.price}
              </p>

              <div className="flex flex-col ">
                <button
                  onClick={handleCustomize}
                  className="bg-gray-800 text-white py-2 px-4 m-1.5 rounded-md hover:bg-gray-700 transition"
                >
                  Customize
                </button>
                <button
                  onClick={handleaddtocart}
                  className="bg-gray-900 text-white py-2 px-4 m-1.5 rounded-md hover:bg-gray-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
