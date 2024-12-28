const model = require("../models/user");
const User = model.User;
const jwt = require("jsonwebtoken");

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    console.error("Error fetching posters:", err);
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.find((user) => user.email === req.body.email);
    res.json(user);
  } catch {
    console.log("User not found");
  }
};
