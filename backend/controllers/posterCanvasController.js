const Postercanvas = require("../models/postercanvas");
const mongoose = require("mongoose");

exports.save_meta_data_of_chunk = async (req, res) => {
  try {
    // console.log(req.body);

    const posterCanvas = new Postercanvas(req.body);
    await posterCanvas.save();
    res.json({ message: "saved metadata of chunk", success: true });
  } catch (err) {
    res.json({ message: "failed to save metadata of chunk", success: false });
  }
};

exports.get_meta_data_of_chunk = async (req, res) => {
  // console.log("check");
  try {
    const posterid = req.query.posterid;
    // console.log(posterid);
    const chunksMetadata = await Postercanvas.find({ posterid }).sort(
      "chunknumber"
    );

    return res.status(200).json(chunksMetadata);
  } catch (error) {
    console.error("Error fetching chunk metadata:", error);
    res.status(500).json({
      message: "Failed to fetch chunk metadata",
      error: error.message,
    });
  }
};
