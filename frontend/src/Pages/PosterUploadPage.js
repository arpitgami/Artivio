import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadPage = () => {
  const [initialState, setInitialState] = useState();
  const [image, setImage] = useState(null); // State for uploaded image
  const [posterData, setPosterData] = useState({
    posterName: "",
    price: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate(); // React Router's navigation

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result); // Set image preview
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPosterData({ ...posterData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    setIsUploading(true);
    e.preventDefault();
    if (image === null) {
      alert("Please upload an image");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/generate-signature",
        {
          upload_preset: "Artivio_designeredit_preset",
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      console.log(response.data);
      const { signature, timestamp, upload_preset, cloud_name } = response.data;

      const formData = new FormData();
      // console.log("image : ", image);
      formData.append("file", image);
      formData.append("upload_preset", upload_preset);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = cloudinaryResponse.data;

      if (data.secure_url) {
        const designer = await axios.get("http://localhost:8080/user", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        console.log("designer", designer.data);
        console.log("posterata", posterData);

        const posterentries = {
          ...posterData,
          imageURL: data.secure_url,
          designersName: designer.data.username,
          designerid: designer.data._id,
        };
        console.log("posterentries: ", posterentries);

        console.log("token", localStorage.getItem("token"));
        const res = await axios.post(
          "http://localhost:8080/posters",
          posterentries,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        console.log("res", res);
        navigate(`/home/yourdesign/upload/${res.data.posterid}`);
      } else {
        alert("Image upload failed!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="absolute top-4 right-4 hover:bg-gray-300 text-black px-4 py-2 rounded "
      >
        Back
      </button>

      {/* Left Side: Image Upload */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-[400px] aspect-[4/5] flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg bg-gray-50">
          {image ? (
            <img
              src={image}
              alt="Uploaded Poster"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex flex-col items-center justify-center text-gray-500 text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 16v2a4 4 0 004 4h10a4 4 0 004-4v-2M16 12l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              <p className="mt-2 text-sm">Click to upload an image</p>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Right Side: Title and Price Fields */}
      <div className="md:w-1/2 w-full flex flex-col justify-center p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Poster Name
            </label>
            <input
              type="text"
              id="posterName"
              name="posterName"
              // value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter poster title"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (in $)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              // value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {isUploading ? "uploading.." : "Upload Poster"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
