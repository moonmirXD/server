const { Router } = require("express");
const bcrypt = require("bcryptjs");
const router = Router();
const User = require("../models/User.js");

router.get("/", async (req, res, next) => {
  try {
    const result = await User.find();
    res.json({
      message: "🔒",
      data: [result],
    });
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  try {
    const username = await User.findOne({ username: user.username });
    if (username) {
      const error = new Error("Username is already used. Try another one.");
      next(error);
    } else {
      bcrypt
        .hash(user.password, 8)
        .then((hashed) => {
          user.password = hashed;
        })
        .then(() => {
          user.save();
          res.json(user);
        });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await User.findById(req.params.id);
    res.json({
      data: [result],
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

module.exports = router;
