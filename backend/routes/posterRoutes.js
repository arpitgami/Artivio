const express = require("express");
const router = express.Router();

const postersController = require("../contoller/postersController");

router
  .get("/posters", postersController.getAllPoster)
  .get("/posters/:id", postersController.getPoster)
  .post("/posters", postersController.createPoster);

module.exports = router;
