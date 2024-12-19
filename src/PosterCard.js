import image from "./Image.png";
export function PosterCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center w-72 relative">
      <img src={image} alt="Porsche 911 GT3 RS" className="w-full" />
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-3">Porsche 911 GT3 RS</h3>
        <div className="text-base text-gray-800">
          From Rs. 900.00 <del className="text-gray-500 ml-2">Rs. 1,800.00</del>
        </div>
      </div>
    </div>
  );
}
