import image from "./Image.png";
export function PosterCard({ poster }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center w-72 relative">
      <img src={poster.image} alt="Porsche 911 GT3 RS" className="w-full" />
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-3">{poster.postername}</h3>
        <div className="text-base text-gray-800">Rs. {poster.price}</div>
      </div>
    </div>
  );
}
