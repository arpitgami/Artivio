import React, { use, useEffect, useState } from "react";
import { NavigationPannel } from "../NavigationPannel";
import axios from "axios";
import { CartItem } from "./CartItemCard";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const []

  useEffect(() => {
    setIsLoading(true);

    async function getdata() {
      try {
        const userres = await axios.get(`http://localhost:8080/user`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        console.log(userres.data);

        const cartres = await axios.get(
          `http://localhost:8080/cart/${userres.data._id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log("cart items : ", cartres.data);
        setCartItems(cartres.data);
        setIsLoading(false);
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
          return <CartItem key={item._id} item={item} />;
        })}
    </>
  );
}

export default Cart;
