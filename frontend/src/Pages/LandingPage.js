import { NavigationPannel } from "../NavigationPannel";
import "../App.css";
import { PosterCard } from "../PosterCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const [posters, setPosters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Getting posters");
    axios("http://localhost:8080/posters")
      .then((res) => {
        setPosters(res.data);
        // console.log(res.data);
      })
      .catch((err) => console.log("Didnt get posters"));
  }, []);

  return (
    <div>
      <NavigationPannel />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[rgb(36,36,36)] ">
        <h1 className="text-7xl text-slate-50"> Artivio </h1>
        <p className=" text-slate-50"> Art That's Uniquely Yours. </p>
      </div>
      {posters &&
        posters.map((poster) => (
          <button
            key={poster._id}
            onClick={() => {
              navigate(`/poster/${poster._id}`);
            }}
          >
            <PosterCard poster={poster} />
          </button>
        ))}
    </div>
  );
}
