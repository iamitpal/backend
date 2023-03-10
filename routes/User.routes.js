const express = require("express");
const { UserModel } = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city } = req.body;
  try {
    bcrypt.hash(password, 3, async (err, hash) => {
      if (err) res.send(err.message);
      else {
        const user = new UserModel({
          name,
          email,
          gender,
          password: hash,
          age,
          city,
        });
        await user.save();
        res.send({ msg: "User Registered Successfully" });
      }
    });
  } catch (error) {
    res.send({
      msg: "Something went wrong while Registering",
      err: error.message,
    });
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "masai");
          res.send({ msg: "User Loggedin", token: token });
        } else {
          res.send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.send({ msg: "Wrong Credentials" });
    }
  } catch (error) {
    res.send({
      msg: "Something went wrong while Login",
      err: error.message,
    });
    console.log(error);
  }
});

module.exports = {
  userRouter,
};
