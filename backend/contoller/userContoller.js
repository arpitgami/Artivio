const model = require("../models/user");
const User = model.User;
const jwt = require("jsonwebtoken");

exports.createUser = (req, res) => {
  const token = jwt.sign(
    { email: `${req.body.email}`, password: `${req.body.password}` },
    "hmm"
  );
  try {
    const user = new User(req.body);
    user.token = token;
    user.save();
    res.json(user);
  } catch (err) {
    console.log("Not able to save user info");
  }
};

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
