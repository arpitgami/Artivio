import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PosterCard } from "../PosterCard";
import { NavigationPannel } from "../NavigationPannel";

export function YourDesignsPage() {
  const [posterData, setPosterData] = useState([]);
  const [designerId, setDesignerId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setDesignerId(res.data._id);
      });
  }, []);

  useEffect(() => {
    if (!designerId) return;
    axios(`http://localhost:8080/posters/designs/${designerId}`)
      .then((res) => {
        setPosterData(res.data);
        // console.log(res.data);
      })
      .catch((err) => console.log("Didnt get posters"));
  }, [designerId]);

  return (
    <>
      <div className="flex flex-col items-center">
        <NavigationPannel />
        <div className="flex flex-wrap gap-10 m-8 justify-center">
          {posterData.length > 0 ? (
            posterData.map((poster) => (
              <PosterCard key={poster._id} poster={poster} />
            ))
          ) : (
            <div className="text-gray-500 text-center mt-8">
              No posters found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
