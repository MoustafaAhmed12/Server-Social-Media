const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// Router
const userRouter = require("./routes/users");

/* ******** DB Config ******** */
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("connected"))
  .catch((e) => console.log(e.message));

/* ******** Middleware ******** */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ******** Routes ******** */
app.use("/api", userRouter);

module.exports = app;
