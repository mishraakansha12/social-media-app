// backend/controllers/authController.js

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


// ========================================
// CREATE JWT TOKEN
// ========================================

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


// ========================================
// REGISTER USER
// POST /api/auth/register
// ========================================

export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;


    // Check fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }


    // Check username already exists
    const usernameExists = await User.findOne({
      username: username.trim(),
    });

    if (usernameExists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }


    // Check email already exists
    const emailExists = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });


    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: createToken(user._id),
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};


// ========================================
// LOGIN USER
// POST /api/auth/login
// ========================================

export const loginUser = async (req, res) => {
  try {

    const {
      emailOrUsername,
      password,
    } = req.body;


    // Check fields
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        message:
          "Email/Username and password are required",
      });
    }


    const loginValue =
      emailOrUsername.trim();


    // Find by email OR username
    const user = await User.findOne({
      $or: [
        {
          email: loginValue.toLowerCase(),
        },
        {
          username: loginValue,
        },
      ],
    });


    if (!user) {
      return res.status(400).json({
        message:
          "Invalid email/username or password",
      });
    }


    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid email/username or password",
      });
    }


    // Success
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: createToken(user._id),
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Server error during login",
    });
  }
};