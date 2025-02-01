const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartControllers");
const { auth } = require("../middleware/auth.js");

router
  .post("/cart", auth, cartController.savetocart)
  .get("/cart/:id", auth, cartController.getcartitemsbyuserid)
  .delete("/cart/:id", auth, cartController.deleteposter)
  .post("/cart/updateQuantity", auth, cartController.updateQuantity);

module.exports = router;
