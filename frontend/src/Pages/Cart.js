import React, { use, useEffect, useState } from "react";
import { NavigationPannel } from "../NavigationPannel";
import axios from "axios";
import { CartItem } from "./CartItemCard";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    async function getdata() {
      try {
        const userres = await axios.get(`http://localhost:8080/user`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        // console.log(userres.data);

        const cartres = await axios.get(
          `http://localhost:8080/cart/${userres.data._id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        // console.log("cart items : ", cartres.data);
        setCartItems(cartres.data);
        setIsLoading(false);
        const total = 0;
      } catch {
        console.log("error");
      }
    }

    getdata();
  }, []);

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
          <div className=" p-4 px-8 bg-base-100 hover:bg-base-200  text-primary">
            Checkout
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
