require("dotenv").config();
const express = require("express");
const server = express();
const router = require("./routers/router");
const mongoose = require("mongoose");
const cors = require("cors");

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
server.use(express.json()); //body parser

server.use("/", router.router);

server.listen(8080);
