const express = require("express");
const router = express.Router();

const postersController = require("../contoller/postersController");

router
  .get("/posters", postersController.getAllPoster)
  .post("/posters", postersController.createPoster);

exports.router = router;
