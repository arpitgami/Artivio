const mongoose = require("mongoose");

const userEditsImageSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  posterid: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  publicid: {
    type: String,
    required: true,
  },
});

// Model
const UserEditsImage = mongoose.model("userEditsImage", userEditsImageSchema);

module.exports = UserEditsImage;
