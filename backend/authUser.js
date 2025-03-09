/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 4000;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/Users.js");
const connectDB = require("./models/connectDB");
const cors = require("cors");
const crypto = require("crypto"); // Add this line at the top of your file
const authMiddleware = require("./authMiddleware");
const nodemailer = require("nodemailer");
app.use(express.json());

//DataBase connection
connectDB();
/**
 * Handles user registration. Also verifies if user already exists by comparing the Email.
 * Adds user to Database with a hashed Password
 */
app.post("/users/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Verify if user 'Email' already exists
    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res
        .status(400)
        .json({ message: "User with this E-mail already exists" });
    }
    //Verify if user 'UserName' already exists
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${username.trim()}$`, "i") },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username already exists. Try a different one" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save(); //save the user into the Database
    res.status(201).send();
  } catch (error) {
    console.log("Error during registration:", error);
    res.status(500).send("Server error");
  }
});
/**
 * Handles user login. Authenticates the user based on email and password.
 * Returns an access token upon successful authentication.
 */
app.post("/users/login", async (req, res) => {
  try {
    const { userLogin, password } = req.body;
    let user;
    user = await User.findOne({
      email: { $regex: new RegExp(`^${userLogin.trim()}$`, "i") },
    }); //Find the user by EMAIL

    if (!user) {
      user = await User.findOne({
        // If not found by email, try by username
        username: { $regex: new RegExp(`^${userLogin.trim()}$`, "i") },
      });
    }
    if (!user) {
      // In case USER is not Found
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password); //Compare Passwords
    if (isMatch) {
      const acessToken = jwt.sign(
        { userId: User._id, email: User.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { userId: User._id, email: User.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      user.refreshToken = refreshToken;
      res.json({
        accessToken: acessToken,
        User: { _id: user._id, username: user.username },
      });
      await user.save();
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json("Server error");
  }
});
/**
 * Allow user to change his password after checking his old password matches
 */
app.post("/users/password", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const { oldPassword, newPassword } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.findOne({ _id: userId });

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
    return;
  } catch (error) {
    console.error("Error changing the password:", error);
    res.status(500).json({ message: "Error changing the password" });
  }
});
/**
 * Logging out and invalidating Refresh Token
 */
app.post("/users/logout", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh Token not found" });
    }
    user.refreshToken = null;
    await user.save();
    //res.clearCookie("refreshToken"); // Clear the cookie (if used)
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error saving user after logout:", error);
    res.status(500).json({ message: "Error during logout" });
  }
});

/**
 * Getting refreshToken from database and send it to the Interceptor API
 */
app.get("/users/:id/refresh_token", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const refreshToken = user.refreshToken;

    if (!refreshToken) {
      return res.status(404).json({ message: "Refresh token not found" });
    }

    res.json({ refreshToken }); // Send only the refresh token
  } catch (error) {
    console.error("Error getting refresh token:", error);
    res.status(500).json({ message: "Error getting refresh token" });
  }
});
/**
 * Handle the creation and Rotation of Refresh Tokens
 */
app.post("/users/refresh_token", async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401); //RefreshToken is NULL
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(403); //RefreshToken not Found
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          user.refreshToken == null;
          await user.save();
          return res.sendStatus(403);
        }

        //Generating a new ACCESS TOKEN
        const accessToken = jwt.sign(
          { userId: User._id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15m",
          }
        );
        //Generating a new Refresh TOKEN
        const newRefreshToken = jwt.sign(
          { userId: User._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        // Update user's refresh token in the database (for rotation)
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken: accessToken });
      }
    );
  } catch (error) {
    console.error("Error in refresh token endpoint:", error);
    res.status(500).json({ message: "Error in refresh token process" });
  }
});
/**
 * The API that allow user to get an email in case he forgot his password. Using only his email, he gets a time limited Token for a Reset
 */
app.post("/users/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // 2. Generate unique token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 hour expiry (in milliseconds)

    // 3. Store token in database
    user.PasswordResetToken = token;
    user.resetPasswordExpiresAt = expiry;
    await user.save();

    // 4. Send password reset email (configure nodemailer transporter)
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
    });
    const mailOptions = {
      from: "noreply@example.com",
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="http://localhost:5173/ResetPassword/${token}">here</a> to reset your password.</p>`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.post("/users/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      PasswordResetToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.PasswordResetToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
