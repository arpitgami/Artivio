import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function PosterCard({ poster }) {
  const location = useLocation();
  const [isDesigner, setIsDesigner] = useState(false);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.isdesigner) {
          setIsDesigner(true);
        }
      });
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center w-72 relative">
      <img src={poster.imageURL} className="w-full" />
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-3">{poster.posterName}</h3>
        {isDesigner && location.pathname === "/home/yourdesign" ? null : (
          <div className="text-base text-gray-800">Rs. {poster.price}</div>
        )}
      </div>
    </div>
  );
}
