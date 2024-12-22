const express = require("express");
const router = express.Router();

const userContollers = require("../contoller/userContoller");

router
  .get("/user/:id", userContollers.getUser)
  .post("/user", userContollers.createUser);

module.exports = router;
