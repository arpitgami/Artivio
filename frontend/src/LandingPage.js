import { NavigationPannel } from "./NavigationPannel";
import "./App.css";
import { PosterCard } from "./PosterCard";
import { useEffect, useState } from "react";
import axios from "axios";

export function LandingPage() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    axios("http://localhost:8080/posters")
      .then((res) => setPosters(res.data))
      .catch((err) => console.log("Didnt get posters"));
  }, []);

  return (
    <div>
      <NavigationPannel />
      <div className="container">
        <h1 class="text-7xl"> Artivio</h1>
        <p> Art That’s Uniquely Yours. </p>
      </div>
      {posters.map((poster) => (
        <PosterCard key={poster.id} poster={poster} />
      ))}
      <div></div>
    </div>
  );
}
