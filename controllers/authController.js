const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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


  const authController = {
    registerUser
  
  };
  
  module.exports = authController;