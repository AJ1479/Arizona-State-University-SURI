const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  age: {
    type: Number,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  education: {
    type: String,
    trim: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  knowledge: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
  },
  feedback: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
