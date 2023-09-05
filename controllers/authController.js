const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const OTPCode = require("../models/OtpCode");
const transporter = require("../utilities/transporter");
require("dotenv").config();


/////// 6 DIGIT CODE GENERATOR
const generateOTPCode = () => {
    const digits = "0123456789";
    let otpCode = "";
    for (let i = 0; i < 6; i++) {
      otpCode += digits[Math.floor(Math.random() * 10)];
    }
    return otpCode;
  };

  const registerUser = async (req, res) => {
    const { firstName, lastName, username, phoneNumber, email, password } = req.body;
  
    try {
      // Check if the user with the given email already exists
      let user = await User.findOne({ email });
  
      if (user) {
        if (user.verified) {
          // Remove the password field from the user object before sending the response
          delete user.password;
  
          return res.status(400).json({
            status: 'fail',
            message: 'User already exists and is verified.',
            user: user,
          });
        }
  
        // Resend OTP for account verification
        const otpCode = generateOTPCode();
  
        // Set the expiration time to 10 minutes from now
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
  
        // Save OTP code to database
        const otpCodeRecord = new OTPCode({
          userId: user._id,
          code: otpCode,
          createdAt: Date.now(),
          expiresAt: expirationTime,
        });
        await otpCodeRecord.save();
  
        // Prepare and send the email using the transporter and sendEmail function
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: user.email,
          subject: "Verify Your Email",
          html: `
            <h1>Email Verification</h1>
            <h3>Welcome ${lastName}, </h3>
            <p>Please enter the verification code to continue.</p>
            <h2><strong>${otpCode}</strong></h2>
          `,
        };
  
        await transporter.sendMail(mailOptions);
  
        return res.status(200).json({
          status: 'success',
          message: 'Account already registered, new OTP sent for verification.',
          user: user,
        });
      }
  
      // If the user does not exist, create a new user and set their verified status to false
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
      const newUser = new User({
        firstName,
        lastName,
        username,
        phoneNumber,
        email,
        password: hashedPassword,
        verified: false,
      });
  
      const savedUser = await newUser.save();
  
      // Send OTP code to user's email
      const otpCode = generateOTPCode();
  
      // Set the expiration time to 10 minutes from now
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
  
      // Save OTP code to database
      const otpCodeRecord = new OTPCode({
        userId: savedUser._id,
        code: otpCode,
        createdAt: Date.now(),
        expiresAt: expirationTime,
      });
      await otpCodeRecord.save();
  
      // Prepare and send the email using the transporter and sendEmail function
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: savedUser.email,
        subject: "Verify Your Email",
        html: `
        <h1>Email Verification</h1>
        <p> Hello, ${lastName}, Welcome to GleegX Tv. Please enter the verification code to continue.</p>
        <h3><strong>${otpCode}</strong></h3>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      return res.status(200).json({
        status: 'success',
        message: 'Sign up successful, OTP sent for verification.',
        user: savedUser,
      });
    } catch (error) {
      console.error('Error while registering user:', error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while signing up. Please try again.',
      });
    }
  };


  

  //////////SIGN-IN USER
  const loginUser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if either username or email is provided
      if (!username && !email) {
        return res.status(400).json({
          status: "failed",
          message: "Username or Email field is required",
        });
      }
  
      let user;
  
      // Find the user based on the provided credentials
      if (email) {
        user = await User.findOne({ email });
      } else if (username) {
        user = await User.findOne({ username });
      }
  
      // Check if a user with the provided credentials exists
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }
  
      // Validate the provided password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid password",
        });
      }
  
      // Check if the user's email is verified
      if (!user.verifiedEmail) {
        return res.status(400).json({
          status: "failed",
          message: "Please verify your email before signing in",
        });
      }
  
      // Set the user's activeStatus to "online"
      user.activeStatus = "online";
      await user.save();
  
      // Create a user details object with the desired fields
      const userDetails = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        activeStatus: user.activeStatus,
        gender: user.gender,
        dob: user.dob,
        relationshipStatus: user.relationshipStatus,
        placeOfOrigin: user.placeOfOrigin,
        resident: user.resident,
        academic: user.academic,
        employment: user.employment,
        interestedIn: user.interestedIn,
        lookingFor: user.lookingFor,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
  
      // Create a JWT token for authentication
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC_KEY, {
        expiresIn: "24h",
      });
  
      return res.status(200).json({
        status: "success",
        message: "Successfully signed in",
        token,
        user: userDetails,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  };
  
  
  const authController = {
    loginUser,
    registerUser
  };
  
  module.exports = authController;