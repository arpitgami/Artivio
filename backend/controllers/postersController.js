const model = require("../models/posters");
const Poster = model.Poster;
const PosterCanvas = require("../models/postercanvas");
const UserEditsImage = require("../models/usereditsimage");
const UserEdits = require("../models/userEdits");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.createPoster = async (req, res) => {
  try {
    console.log("Poster data received:", req.body);
    if (req.body._id) {
      // Update existing poster
      await Poster.findByIdAndUpdate(req.body._id, req.body);
      return res.json({
        message: "Poster updated successfully",
        success: true,
        posterid: req.body._id,
      });
    }
    const poster = new Poster(req.body);
    await poster.save().then((poster) => {
      res.status(200).json({
        message: "Poster data saved successfully!",
        success: true,
        posterid: poster._id,
      });
    });
  } catch (err) {
    console.log("Not able to save poster info");
    res.status(500).json({
      message: "Not able to save poster info",
      err: err.message,
      success: false,
    });
  }
};

module.exports.getAllPoster = async (req, res) => {
  try {
    const posters = await Poster.find();
    res.json(posters);
  } catch (err) {
    console.error("Error fetching posters:", err);
    res.json({ message: "Error fetching posters", success: false });
  }
};
exports.getPoster = async (req, res) => {
  try {
    const _id = req.params.id;
    const poster = await Poster.find({ _id });
    res.json(poster);
  } catch (err) {
    console.error("Error fetching posters:", err);
    res.json({ message: "Error fetching poster", success: false });
  }
};
exports.getPosterByDesignerId = async (req, res) => {
  try {
    const designerid = req.params.id;
    const poster = await Poster.find({ designerid: designerid });
    res.json(poster);
  } catch (err) {
    console.error("Error fetching posters:", err);
    res.json({ message: "Error fetching poster", success: false });
  }
};

exports.deletePosterByID = async (req, res) => {
  try {
    const { posterid, designerid } = req.body;
    console.log("deleteposter body: ", req.body);

    // Delete original poster data
    const posterdata = await Poster.findOneAndDelete({ _id: posterid });
    if (posterdata) {
      await cloudinary.uploader.destroy(posterdata.publicid);
    }

    // Delete original poster canvas chunks
    const posterschunksdata = await PosterCanvas.find({
      designerid,
      posterid,
    });
    await PosterCanvas.deleteMany({
      designerid,
      posterid,
    });
    if (posterschunksdata.length > 0) {
      await Promise.all(
        posterschunksdata.map((chunk) =>
          cloudinary.uploader
            .destroy(chunk.publicid)
            .catch((err) =>
              console.error("Error deleting chunk from Cloudinary: ", err)
            )
        )
      );
    }

    // Delete user edits images
    const usereditsimagedata = await UserEditsImage.find({ posterid });
    await UserEditsImage.deleteMany({ posterid });
    if (usereditsimagedata.length > 0) {
      await Promise.all(
        usereditsimagedata.map((image) =>
          cloudinary.uploader
            .destroy(image.publicid)
            .catch((err) =>
              console.error("Error deleting user edit image: ", err)
            )
        )
      );
    }

    // Delete user edits canvas
    const usereditsdata = await UserEdits.find({ posterid });
    await UserEdits.deleteMany({ posterid });
    if (usereditsdata.length > 0) {
      await Promise.all(
        usereditsdata.map((edit) =>
          cloudinary.uploader
            .destroy(edit.publicid)
            .catch((err) =>
              console.error("Error deleting user edit canvas: ", err)
            )
        )
      );
    }

    res.json({
      message: "Poster and all associated data deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in deletePosterByID: ", error);
    res.status(500).json({
      message: "Failed to delete poster and associated data",
      success: false,
      error: error.message,
    });
  }
};
