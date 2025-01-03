const model = require("../models/posters");
const Poster = model.Poster;
const mongoose = require("mongoose");

module.exports.createPoster = async (req, res) => {
  try {
    console.log("Poster data received:", req.body);
    const poster = new Poster(req.body);
    await poster.save().then((poster) => {
      res
        .status(200)
        .json({
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
