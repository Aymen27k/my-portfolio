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
 * Get all users from the Database
 */
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).send("Server error");
  }
});
/**
 * Handles user registration. Also verifies if user already exists by comparing the Email.
 * Adds user to Database with a hashed Password
 */
app.post("/users/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Verify if user 'Email' already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User with this E-mail already exists");
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
 * Returns an access token and refresh token upon successful authentication.
 */
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); //Find the user by EMAIL
    if (!user) {
      return res.status(400).json("User not found");
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
        { expiresIn: "1d" }
      );
      user.refreshToken = refreshToken;
      res.json({
        accessToken: acessToken,
        User: { _id: user._id, username: user.username },
      });
      await user.save();
    } else {
      res.status(400).json("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json("Server error");
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
          { expiresIn: "1d" }
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
app.post("/users/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // 1. Check if user exists
    const user = await User.findOne({ email }); // Replace User with your user model
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
      html: `<p>Click <a href="https://yourwebsite.com/reset-password?token=${token}">here</a> to reset your password.</p>`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
