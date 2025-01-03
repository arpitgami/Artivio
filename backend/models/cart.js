const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  posterid: {
    type: String,
    required: true,
  },
  customized: {
    type: Boolean,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Model
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
