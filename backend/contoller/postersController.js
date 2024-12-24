const model = require("../models/posters");
const Poster = model.Poster;
const mongoose = require("mongoose");

exports.createPoster = (req, res) => {
  try {
    const poster = new Poster(req.body);
    poster.save();
  } catch (err) {
    console.log("Not able to save");
  }
};

exports.getAllPoster = async (req, res) => {
  try {
    const posters = await Poster.find();
    res.json(posters);
  } catch (err) {
    console.error("Error fetching posters:", err);
  }
};
exports.getPoster = async (req, res) => {
  try {
    const _id = req.params.id;
    const poster = await Poster.find({ _id });
    res.json(poster);
  } catch (err) {
    console.error("Error fetching posters:", err);
  }
};
