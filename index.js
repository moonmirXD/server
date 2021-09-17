const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const middlewares = require("./auth/middlewares.js");
const auth = require("./auth/index.js");

require("dotenv/config");

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(middlewares.checkTokenUser);

app.get("/", (req, res) => {
  res.json({
    message: "Hello world! 🌏",
    user: req.user,
  });
});

app.use("/auth", auth);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Not Found - " + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Listening on port", port);
});
