const UserEditsImage = require("../models/usereditsimage");
const mongoose = require("mongoose");

exports.save_image = async (req, res) => {
  try {
    await UserEditsImage.findOneAndUpdate(
      { publicid: req.body.publicid }, // Filter
      req.body, // Update data
      { upsert: true, new: true } // Create if not found, return the updated document
    );
    res.json({ message: "Saved image of edits", success: true });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.json({ message: "Failed to save image of edits", success: false });
  }
};

// exports.deleteImage = async (req, res) => {
//   try {
//     await UserEditsImage.findOneAndDelete({ publicid: req.body.publicid });
//     res.json({ message: "deleted image of edits", success: true });
//   } catch (err) {
//     res.json({ message: "failed to delete image of edits", success: false });
//   }
// };

exports.getAllImagebyUser = async (req, res) => {
  try {
    const alleditsimages = await UserEditsImage.find({
      userid: req.params.id,
    });
    res.json(alleditsimages);
  } catch (err) {
    res.json({ message: "failed to get images of edits", success: false });
  }
};

exports.getAllImage = async (req, res) => {
  try {
    // console.log(req.query);
    const posterid = req.query.posterid;
    // console.log(posterid);
    const userid = req.query.userid;
    if (!posterid) {
      const alleditsimages = await UserEditsImage.find({
        userid: userid,
      });
      return res.json(alleditsimages);
    }

    const singleimage = await UserEditsImage.find({
      userid: req.query.userid,
      posterid: req.query.posterid,
    });
    return res.json(singleimage);
  } catch (err) {
    res.json({ message: "failed to get images of edits", success: false });
  }
};
