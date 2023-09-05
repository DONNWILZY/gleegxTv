const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const bodyParser = require("body-parser");
const cookie = require("cookie");
const dotenv = require("dotenv");
dotenv.config();

app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON request bodies

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader === "undefined") {
    return res.status(403).json({
      status: 403,
      message: "You are not authenticated",
    });
  }

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  req.token = bearerToken;

  try {
    const user = jwt.verify(req.token, process.env.JWT_SEC_KEY);
    req.user = user;

    next();
  } catch (err) {
    return next(new createError("Token is not valid or expired", 403));
  }
};

// Middleware to verify user role as Moderator
const verifyModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user && user.role === "isModerator") {
      req.doctorId = user._id; // Save the doctorId as a new request object
      next();
    } else {
      return next(new AppError("You are not a verified MODERATOR", 401));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

// Middleware to verify user role as Admin
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user && (user.role === 'isAdmin' || user.role === 'isUser')) {
      // Use === for strict equality
      next();
    } else {
      return next(new AppError('You are not an ADMIN', 401));
    }
  } catch (error) {
    console.error('Middleware Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// Middleware to verify user role as User
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user.role === 'isUser') {
      // Use === for strict equality
      next();
    } else {
      return next(new AppError('You are not a verified USER', 401));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

module.exports = {
  AppError,
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyModerator,
};
   