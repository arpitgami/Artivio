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
  .get(
    "/posters/getchunksbyuser",
    auth,
    userEditsController.get_meta_data_of_chunk
  )
  .post(
    "/posters/deletechunksofdesigner",
    auth,
    posterCanvasController.delete_chunks
  )
  .post("/posters/deletechunksofuser", auth, userEditsController.delete_chunks)
  .post("/posters", postersController.createPoster)
  .get("/posters/:id", postersController.getPoster)
  .get("/posters/designs/:id", postersController.getPosterByDesignerId)
  .post(
    "/posters/savechunkfromuser",
    userEditsController.save_meta_data_of_chunk
  )
  .post(
    "/posters/savechunkfromdesigner",
    posterCanvasController.save_meta_data_of_chunk
  );

module.exports = router;
