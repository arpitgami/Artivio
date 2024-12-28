require("dotenv").config();
const express = require("express");
const server = express();
const posterRoutes = require("./routes/posterRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const { auth } = require("./middleware/auth");

//database connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose
    .connect(
      `mongodb+srv://arpitgami13:${process.env.PASSWORD}@artiviocluster.5nwan.mongodb.net/`
    )
    .then(() => console.log("Database Connected"))
    .catch(() => console.log("Database NOT Connected"));
}

server.use(cors());
server.use(express.json({ limit: "50mb" })); //body parser

server.use("/auth", authRoutes);
server.use("/", posterRoutes);
server.use("/", userRoutes);
server.get("/checktoken", auth, (req, res) =>
  res.json({ message: "Token is valid", success: true })
);

server.listen(8080);
