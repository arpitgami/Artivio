const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { googlecontroller } = require("../controllers/googleController");

router
  .post("/login", authController.login)
  .post("/signup", authController.signUp)
  .post("/google", googlecontroller)
  .post("/designersignup", authController.designersignup)
  .get("/approve", authController.approveDesigner);

module.exports = router;
