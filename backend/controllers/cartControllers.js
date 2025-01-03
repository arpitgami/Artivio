const Cart = require("../models/cart");
const mongoose = require("mongoose");

exports.savetocart = async (req, res) => {
  try {
    const find = await Cart.findOne({
      userid: req.body.userid,
      posterid: req.body.posterid,
      customized: req.body.customized,
    });
    if (find) {
      return res.json({
        message: "Poster already in the cart",
        success: false,
      });
    }
    const cart = new Cart(req.body);
    await cart.save();
    res.json({ message: "Poster added to cart", success: true });
  } catch (err) {
    res.json({ message: "failed to saved poster to cart", success: false });
  }
};

exports.getcartitemsbyuserid = async (req, res) => {
  try {
    const userid = req.params.id;
    const userposters = await Cart.find({ userid: userid });
    return res.status(200).json(userposters);
  } catch (error) {
    console.error("Error fetching user cart posters ", error);
    res.status(500).json({
      message: "Failed to fetch user cart posters",
      error: error.message,
    });
  }
};

exports.deleteposter = async (req, res) => {
  try {
    const itemid = req.params.id;
    await Postercanvas.findOneAndDelete({ _id: itemid });
    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item." });
  }
};
