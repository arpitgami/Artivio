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
      <div className="flex flex-col min-h-screen ">
        <NavigationPannel className="sticky top-0 z-10" />

        {/* Content Section */}
        <div className="relative z-9 flex-1 flex items-center justify-center bg-cover bg-center my-10 bg-[url('https://res.cloudinary.com/drhmsjhpq/image/upload/v1736095806/MainPage_zoq7ra.webp')]">
          {/* Text Overlay */}
          <div className="text-center bg-primary p-12 rounded-3xl">
            <h1 className="text-7xl text-base-100 font-bold mx-5">Artivio</h1>
            <p className="text-base-100 text-sm mt-1 drop-shadow-md">
              Art That's Uniquely Yours.
              <br />
              {/* <div className="text-base-300 mt-8">
                Get amazing posters by talented designers and turn them into
                something uniquely <br />
                yours,effortlessly.
              </div> */}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-4/6 mx-auto flex-col">
        <div className="divider " />
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="font-bold text-4xl my-2">NEW THIS WEEK !!</div>
        <div className="font-normal text-primary-content text-md my-2 mb-6">
          Our designers are always dropping new designs. Here's what we dropped
          this week...
        </div>
        {posters.length > 0 && (
          <div className="flex flex-wrap gap-20 justify-center items-center w-5/6">
            {posters.slice(0, 3).map((poster) => (
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
        )}
      </div>
    </div>
  );
}
