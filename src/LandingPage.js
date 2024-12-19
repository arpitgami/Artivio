import { NavigationPannel } from "./NavigationPannel";
import "./App.css";
import { PosterCard } from "./PosterCard";

export function LandingPage() {
  return (
    <div>
      <NavigationPannel />
      <div className="container">
        <h1 class="text-7xl"> Artivio</h1>
        <p> Art That’s Uniquely Yours. </p>
      </div>
      <PosterCard />
      <div></div>
    </div>
  );
}
