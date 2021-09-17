const { Router } = require("express");
const bcrypt = require("bcryptjs");
const router = Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function createTokenResponse(user, res, next) {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  jwt.sign(
    payload,
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        res.status(422);
        const error = new Error("Unable to login.");
        next(error);
      }
      res.json({
        token,
      });
    }
  );
}

router.get("/", async (req, res, next) => {
  try {
    const result = await User.find();
    res.json({
      message: "🔒",
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const result = await User.findOne({ username: req.body.username });
    if (result) {
      const error = new Error("Username is already used. Try another one.");
      res.status(400);
      next(error);
    } else {
      const hashed = await bcrypt.hash(req.body.password, 12);
      const newUser = {
        username: req.body.username,
        password: hashed,
      };
      const registeredUser = new User(newUser).save();
      createTokenResponse(registeredUser, res, next);
    }
  } catch (error) {
    res.status(422);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await User.findById(req.params.id);
    res.json({
      data: result,
    });
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await User.remove({ _id: req.params.id });
    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { username: req.body.username, password: req.body.password } }
    );
    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((result) => {
        if (result) {
          createTokenResponse(user, res, next);
        } else {
          res.status(422);
          const error = new Error("Unable to login.");
          next(error);
        }
      });
    } else {
      res.status(422);
      const error = new Error("Unable to login.");
      next(error);
    }
  } catch (err) {
    res.status(422);
    const error = new Error("Unable to login.");
    next(err);
  }
});

module.exports = router;
