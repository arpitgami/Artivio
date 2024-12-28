const express = require("express");
const router = express.Router();

const userContollers = require("../controllers/userContoller");

router.get("/user/:id", userContollers.getUser);
// .post("/user", userContollers.createUser);

module.exports = router;
