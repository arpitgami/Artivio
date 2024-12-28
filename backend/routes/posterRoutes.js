const express = require("express");
const router = express.Router();

const postersController = require("../controllers/postersController.js");
const userEditsController = require("../controllers/userEditsController");
const posterCanvasController = require("../controllers/posterCanvasController");
const { auth } = require("../middleware/auth.js");

router
  .get("/posters", postersController.getAllPoster)
  .get(
    "/posters/getchunksbydesigner",
    auth,
    posterCanvasController.get_meta_data_of_chunk
  )
  .get("/posters/:id", postersController.getPoster)
  .post("/posters", postersController.createPoster)
  .post(
    "/posters/savechunkfromuser",
    userEditsController.save_meta_data_of_chunk
  )
  .post(
    "/posters/savechunkfromdesigner",
    posterCanvasController.save_meta_data_of_chunk
  );

module.exports = router;
