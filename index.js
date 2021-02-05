const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const auth = require("./auth/index.js");

app.use(morgan("dev"));
app.use(express.json());

require("dotenv/config");

app.get("/", (req, res) => {
  res.json({
    message: "Hello world! 🌏",
  });
});

app.use("/auth", auth);

function notFound(req, res, next) {
  res.status(400);
  const error = new Error("Not found - ", req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Listening on port", port);
});
