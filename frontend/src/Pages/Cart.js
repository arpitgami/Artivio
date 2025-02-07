import React, { use, useEffect, useState } from "react";
import { NavigationPannel } from "../NavigationPannel";
import axios from "axios";
import { CartItem } from "./CartItemCard";
import { loadStripe } from "@stripe/stripe-js";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [userid, setUserID] = useState("");

  useEffect(() => {
    setIsLoading(true);

    async function getdata() {
      try {
        const userres = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        // console.log(userres.data);
        setUserID(userres.data._id);
        // console.log("userid", userid);

        const cartres = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/cart/${userres.data._id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log("cart items : ", cartres.data);
        setCartItems(cartres.data);

        // Fetch posters and calculate total
        let totalAmount = 0;
        for (const item of cartres.data) {
          const posterRes = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/posters/${item.posterid}`,
            {
              headers: { Authorization: localStorage.getItem("token") },
            }
          );
          totalAmount += item.quantity * posterRes.data[0].price;
        }
        setTotal(totalAmount);
        setIsLoading(false);
        const total = 0;
      } catch {
        console.log("error");
      }
    }

    getdata();
  }, []);

  async function makePayment() {
    try {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/checkout`,
        { userid: userid },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const session = response.data;
      console.log("session:", session.id);
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.log("Error in making payment:", error);
    }
  }

  return (
    <>
      <NavigationPannel />

      {isLoading ? <h1>Loading...</h1> : null}
      {!isLoading && cartItems.length === 0 && (
        <div className="text-center text-2xl mt-8">No items in cart</div>
      )}

      {!isLoading &&
        cartItems.length > 0 &&
        cartItems.map((item) => {
          return (
            <CartItem
              key={item._id}
              item={item}
              total={total}
              setTotal={setTotal}
            />
          );
        })}
      {!isLoading && cartItems.length > 0 && (
        <div className="fixed bottom-0 left-3/4  bg-primary text-base-100 flex justify-between items-center shadow-lg shadow-black">
          <div className=" py-4 px-6 pr-20"> Total : </div>
          <div className=" py-4 relative  pr-5"> Rs. {total}</div>
          <div
            className=" p-4 px-8 bg-base-100 hover:bg-base-200  text-primary"
            onClick={makePayment}
          >
            Checkout
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
