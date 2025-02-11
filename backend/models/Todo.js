const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add userId field
});

const Todo = mongoose.model("Todo", todoSchema); // Create the model

module.exports = Todo;
