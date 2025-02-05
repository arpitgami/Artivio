const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema({
  imageURL: {
    type: String, // URLto the image
    required: true,
  },
  posterName: {
    type: String,
    required: true,
    trim: true,
  },
  designersName: {
    type: String,
    required: true,
    trim: true,
  },
  designerid: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, //non-negative
  },
  createdAt: {
    type: Date,
    default: Date.now, //date
  },
  publicid: {
    type: String,
    required: true,
  },
});

// Model
const Poster = mongoose.model("Poster", posterSchema);

module.exports = Poster;
