// const model =
const User = require("../models/user");

// exports.getAllUser = async (req, res) => {
//   try {
//     const user = await User.find();
//     res.json(user);
//   } catch (err) {
// console.error("Error fetching posters:", err);
//   }
// };

exports.getUser = async (req, res) => {
  try {
    const email = req.email;
    const user = await User.findOne({ email });
    res.json(user);
  } catch {
    console.log("User not found");
    res.json({ message: "User not found", success: false });
  }
};
