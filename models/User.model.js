const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  gender: { type: String },
  pass: { type: String },
  age: Number,
  city: { type: String },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
