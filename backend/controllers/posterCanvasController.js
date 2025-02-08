const Postercanvas = require("../models/postercanvas");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    console.log(req.query);
    const posterid = req.query.posterid;
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

exports.delete_chunks = async (req, res) => {
  const { chunks } = req.body;

  try {
    for (const chunk of chunks) {
      // Delete chunk from Cloudinary
      await cloudinary.uploader.destroy(chunk.publicid, {
        resource_type: "raw",
      });

      // Delete chunk from MongoDB
      await Postercanvas.findOneAndDelete({ publicid: chunk.publicid });
    }

    res.status(200).json({ message: "Chunks deleted successfully!" });
  } catch (error) {
    console.error("Error deleting chunks:", error);
    res.status(500).json({ error: "Failed to delete chunks." });
  }
};
