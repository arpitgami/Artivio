import React, { useEffect, useState } from "react";
import axios from "axios";

export function CartItem({ item, total, setTotal }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [posterdetails, setPosterdetails] = useState(null);

  useEffect(() => {
    // console.log("item:", item);

    async function getPoster() {
      try {
        const posterRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posters/${item.posterid}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        // console.log("poster resp:", posterRes.data[0]);

        if (item.customized) {
          const imageEditRes = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/posters/uploadimage?userid=${item.userid}&posterid=${item.posterid}`,
            {
              headers: { Authorization: localStorage.getItem("token") },
            }
          );
          // console.log("image_edit_res:", imageEditRes.data[0].imageURL);

          const data = posterRes.data[0];
          data.imageURL = imageEditRes.data[0].imageURL;
          setPosterdetails(data);
        } else {
          setPosterdetails(posterRes.data[0]);
        }
      } catch (error) {
        console.error("Error fetching poster details:", error);
      }
    }

    getPoster();
  }, [item]);

  // useEffect(() => {
  //   // console.log("poster details:", posterdetails);
  // }, [quantity]);

  const updateQuantity = async (newQuantity) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/cart/updateQuantity`,
        {
          _id: item._id,
          userid: item.userid,
          posterid: item.posterid,
          quantity: newQuantity,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setQuantity(newQuantity);
      setTotal(
        (prevTotal) =>
          prevTotal + (newQuantity - quantity) * posterdetails.price
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (!posterdetails) {
    return;
    // <div className="text-center text-lg p-4">Loading poster details...</div>
  }

  return (
    <div className="bg-base-100 flex justify-between items-center p-8 w-full mx-auto rounded-3xl m-4">
      <div className="relative flex flex-row right-0">
        <div>
          <img
            src={posterdetails.imageURL}
            alt={posterdetails.posterName}
            className="rounded-lg shadow-2xl w-24 h-30 mr-4"
          />
        </div>
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold mt-3">
            {posterdetails.posterName}
          </h1>
          <div className="p-1 rounded-md">A4</div>
          <div className="bg-base-300 p-1 px-2 rounded-md mt-1">
            {item.customized ? "Customized" : "Original"}
          </div>
        </div>
      </div>

      <div className="">
        <button
          className="btn bg-base-200 btn-sm btn-circle btn-ghost"
          onClick={() => updateQuantity(quantity + 1)}
        >
          +
        </button>
        <span className="mx-2">{quantity}</span>
        <button
          className="btn bg-base-200 btn-sm btn-circle btn-ghost"
          onClick={() => updateQuantity(Math.max(1, quantity - 1))}
        >
          -
        </button>
      </div>
      <div className="text-xl font-medium mb-0.5 mt-1">
        Rs. {posterdetails.price}
      </div>
    </div>
  );
}
