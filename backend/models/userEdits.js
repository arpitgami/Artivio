const mongoose = require("mongoose");

const userEditsSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  posterid: {
    type: String,
    required: true,
  },
  chunkjson: {
    type: String,
    required: true,
  },
  chunknumber: {
    type: Number,
    required: true,
  },
  publicid: {
    type: String,
    required: true,
  },
});

// Model
const UserEdits = mongoose.model("userEdits", userEditsSchema);

module.exports = UserEdits;
