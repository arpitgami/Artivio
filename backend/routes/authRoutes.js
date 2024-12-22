const express = require("express");
const router = express.Router();

const authController = require("../contoller/authController");

router
  .post("/login", authController.login)
  .post("/signup", authController.signUp);

module.exports = router;
