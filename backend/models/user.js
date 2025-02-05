const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "enter the username"] },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, "User email required"],
  },
  password: {
    type: String,
    minLength: [6, "Password must be at least 6 characters long"],
    // required: [true, "Enter the password"],
  },
  // token: String,
  isdesigner: { type: Boolean, default: false },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
