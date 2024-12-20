const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema({
  image: {
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
  price: {
    type: Number,
    required: true,
    min: 0, //non-negative
  },
  createdAt: {
    type: Date,
    default: Date.now, //date
  },
});

// Model
const Poster = mongoose.model("Poster", posterSchema);

exports.Poster = Poster;
