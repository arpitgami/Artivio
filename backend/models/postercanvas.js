const mongoose = require("mongoose");

const posterCanvasSchema = new mongoose.Schema({
  designerid: {
    type: String,
    required: true,
  },
  posterid: {
    type: String,
    required: true,
  },
  chunknumber: {
    type: Number,
    required: true,
  },
  chunkjson: {
    type: String,
    required: true,
  },
  publicid: {
    type: String,
    required: true,
  },
});

// Model
const PosterCanvas = mongoose.model("posterCanvas", posterCanvasSchema);

module.exports = PosterCanvas;
