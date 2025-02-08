const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

exports.signUp = async (req, res) => {
  try {
    const email = req.body.email;
    const check = await User.findOne({ email });
    if (check) {
      return res.json({
        message: "User already exist, you can login",
        success: false,
      });
    }
    const token = jwt.sign(
      { email: req.body.email, username: req.body.username },
      process.env.SECRETKEY,
      { expiresIn: "24h" }
    );
    const user = await new User(req.body);
    // user.token = token;
    const password = req.body.password;

    await bcrypt
      .hash(password, 10)
      .then((res) => {
        user.password = res;
      })
      .catch((err) => {
        console.log("password not bcryted");
      });

    await user.save().then((savedUser) => {
      res.status(200).json({
        token: token,
        username: savedUser.username,
        id: savedUser._id,
        message: "Signup successfully",
        success: true,
      });
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      // Handle Mongoose validation errors
      return res.status(400).json({
        message: "Validation failed.",
        errors: err.errors,
        success: false,
      });
    }
    console.error(err);
    res.status(500).json({
      message: "An error occurred while saving user info.",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "User doesn't exist, please signup.",
        success: false,
      });
    }

    if (user.isdesigner && !user.isapproved) {
      return res.json({
        message: "Designer not approved yet, please wait for approval.",
        success: false,
      });
    }

    const isAuth = await bcrypt.compare(req.body.password, user.password);
    if (isAuth) {
      const token = jwt.sign(
        { email: req.body.email, username: req.body.username },
        process.env.SECRETKEY,
        { expiresIn: "24h" }
      );
      // user.token = token;
      await user.save().then((savedUser) => {
        res.status(200).json({
          token: token,
          isdesigner: savedUser.isdesigner,
          username: savedUser.username,
          // id: savedUser._id,
          message: "Login successfully",
          success: true,
        });
      });
    } else {
      res.json({
        message: "Wrong Password",
        success: false,
      });
    }
  } catch (err) {
    res.json({ message: "Not able to login", success: false });
  }
};

exports.designersignup = async (req, res) => {
  try {
    // console.log(req.body);
    const email = req.body.email;
    const designer = await User.findOne({ email });
    if (designer) {
      return res.json({
        message: "Already applied for designer, please wait for approval",
        success: false,
      });
    }
    const newUser = await User.create(req.body);
    const approvalToken = uuidv4();
    newUser.approvalToken = approvalToken;
    newUser.isapproved = false;
    const password = req.body.password;

    await bcrypt
      .hash(password, 10)
      .then((res) => {
        newUser.password = res;
      })
      .catch((err) => {
        console.log("password not bcryted");
      });
    await newUser.save();

    const approveLink = `${process.env.API_BASE_URL}/auth/approve?designerId=${newUser._id}&token=${approvalToken}`;

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: "arpitgami13@gmail.com",
      subject: "New Designer Signup - Approval Needed",
      html: `<p>A new designer has signed up:</p>
           <p><strong>Name:</strong> ${newUser.username}</p>
           <p><strong>Email:</strong> ${newUser.email}</p>
           <a href="${approveLink}" style="padding:10px 20px; background-color:black; color:white; text-decoration:none; border-radius:5px;">
             Approve Designer
           </a>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Designer Signup Successful", success: true });
  } catch (err) {
    console.log(err);
    res.json({ error: err, message: "Designer Signup Failed", success: false });
  }
};

exports.approveDesigner = async (req, res) => {
  try {
    const { designerId, token } = req.query;
    // console.log("designerid and token : ", designerId, token);

    const designer = await User.findById({ _id: designerId });
    if (!designer) {
      return res.status(404).send("Designer not found");
    }

    if (designer.isapproved) {
      return res.send("This designer has already been approved.");
    }

    if (!designer.approvalToken || designer.approvalToken !== token) {
      return res.status(401).send("Invalid or expired approval link.");
    }

    // Approve the designer
    designer.isapproved = true;
    designer.approvalToken = null; // Invalidate the token
    await designer.save();

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: designer.email,
      subject: "Your Designer Account Has Been Approved!",
      html: `<p>Congratulations ${designer.username}, your account has been approved!</p>
                 <p>You can now start uploading your designs.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.send("Designer approved successfully!");
  } catch (error) {
    console.error("Error approving designer:", error);
    res.status(500).send("Error approving designer");
  }
};
