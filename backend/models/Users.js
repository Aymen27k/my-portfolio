/* eslint-disable no-undef */
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure usernames are unique
      trim: true, // Remove whitespace from start/end
      minlength: 3, // Minimum username length
      maxlength: 50, // Maximum username length
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
      trim: true,
      lowercase: true, // Store emails in lowercase
      match: [
        // Basic email validation using a regular expression
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
    refreshToken: { type: String }, // For refresh tokens
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const User = mongoose.model("User", userSchema);

module.exports = User;
