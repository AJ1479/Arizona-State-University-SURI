const mongoose = require("mongoose");
const {questionSchema} = require('./questionSchema');

const inputSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  Response: {
    type: [questionSchema],
  },
});

const Input = mongoose.model("Input", inputSchema);
module.exports = Input;
