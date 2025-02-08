const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.googlecontroller = async (req, res) => {
  const credential = req.body.credential;
  // console.log(credential);
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;
    console.log(email, name);

    const token = jwt.sign(
      { email: email, username: name },
      process.env.SECRETKEY,
      { expiresIn: "24h" }
    );
    const check = await User.findOne({ email: email });
    console.log(check, "token : ", token);
    if (check && check.isdesigner && !check.isapproved) {
      return res.json({
        message: "Designer not approved yet please wait.",
        success: false,
      });
    }

    if (!check) {
      const user = new User({ email: email, username: name });
      await user.save();
      res.status(200).json({
        token: token,
        username: name,
        isdesigner: user.isdesigner,
        message: "Google Signin successfully",
        success: true,
      });
    }

    res.status(200).json({
      token: token,
      username: name,
      isdesigner: check.isdesigner,
      message: "Google Signin successfully",
      success: true,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
      success: false,
    });
  }
};
