import axios from "axios";
import { useEffect, useState } from "react";
import { PosterCard } from "../PosterCard";
import { useNavigate } from "react-router-dom";
import { NavigationPannel } from "../NavigationPannel";
import { Footer } from "../component/footer";

function AllPoster() {
  const [posters, setPosters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Getting posters");
    axios(`${process.env.REACT_APP_API_BASE_URL}/posters`)
      .then((res) => {
        setPosters(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log("Didnt get posters"));
  }, []);

  return (
    <>
      <NavigationPannel />
      <div className="flex flex-col justify-center items-center">
        <div className="font-bold text-4xl mt-6">Our Collection !!</div>
        <div className="flex w-1/12 mx-auto flex-col mb-4 ">
          <div className="divider " />
        </div>
        {posters.length > 0 && (
          <div className="flex flex-wrap gap-20 justify-center items-center w-5/6">
            {posters.map((poster) => (
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
      <Footer />
    </>
  );
}

export default AllPoster;
