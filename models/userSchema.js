const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
