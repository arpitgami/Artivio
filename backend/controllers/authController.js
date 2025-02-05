const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const email = req.body.email;
    const check = await User.findOne({ email });
    if (check) {
      return res.json({
        message: "User already exist, you can login",
        success: false,
      });
    }
    const token = jwt.sign(
      { email: req.body.email, username: req.body.username },
      process.env.SECRETKEY,
      { expiresIn: "24h" }
    );
    const user = await new User(req.body);
    // user.token = token;
    const password = req.body.password;

    await bcrypt
      .hash(password, 10)
      .then((res) => {
        user.password = res;
      })
      .catch((err) => {
        console.log("password not bcryted");
      });

    await user.save().then((savedUser) => {
      res.status(200).json({
        token: token,
        username: savedUser.username,
        id: savedUser._id,
        message: "Signup successfully",
        success: true,
      });
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      // Handle Mongoose validation errors
      return res.status(400).json({
        message: "Validation failed.",
        errors: err.errors,
        success: false,
      });
    }
    console.error(err);
    res.status(500).json({
      message: "An error occurred while saving user info.",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "User doesn't exist, please signup.",
        success: false,
      });
    }

    const isAuth = await bcrypt.compare(req.body.password, user.password);
    if (isAuth) {
      const token = jwt.sign(
        { email: req.body.email, username: req.body.username },
        process.env.SECRETKEY,
        { expiresIn: "24h" }
      );
      // user.token = token;
      await user.save().then((savedUser) => {
        res.status(200).json({
          token: token,
          isdesigner: savedUser.isdesigner,
          username: savedUser.username,
          // id: savedUser._id,
          message: "Login successfully",
          success: true,
        });
      });
    } else {
      res.json({
        message: "Wrong Password",
        success: false,
      });
    }
  } catch (err) {
    res.json({ message: "Not able to login", success: false });
  }
};
