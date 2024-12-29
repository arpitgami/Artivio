const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { auth } = require("../middleware/auth.js");

router.get("/user", auth, userController.getUser);
// // .post("/user", userContollers.createUser);

module.exports = router;
