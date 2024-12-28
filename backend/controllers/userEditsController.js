const UserEdits = require("../models/userEdits");
const mongoose = require("mongoose");

exports.save_meta_data_of_chunk = async (req, res) => {
  try {
    // console.log(req.body);

    const useredits = new UserEdits(req.body);

    await useredits.save();
    res.json({ message: "saved metadata of chunk", success: true });
  } catch (err) {
    res.json({ message: "failed to save metadata of chunk", success: false });
  }
};
