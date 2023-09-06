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
  
      if (!username && !email) {
        return res.status(400).json({
          status: "failed",
          message: "Username or Email field is required",
        });
      }
  
      let user;
  
      if (email) {
        // If an email is provided, find the user by email
        user = await User.findOne({ email });
      } else {
        // If username is provided, find the user by username
        user = await User.findOne({ username });
      }
  
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid password",
        });
      }
  
      if (!user.verifiedEmail) {
        return res.status(400).json({
          status: "failed",
          message: "Please verify your email before signing in",
        });
      }
  
      // Set the user's activeStatus to "online"
      user.activeStatus = "online";
      await user.save();
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC_KEY, {
        expiresIn: "24h",
      });
  
      // Create a user details object with the desired fields
      let userDetails = {
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
        socialMedia: user.socialMedia,
        pastRelationship: user.pastRelationship,
        yourChoiceOfPartner: user.yourChoiceOfPartner,
        redFlags: user.redFlags,
        dealBreaker: user.dealBreaker,
        dislikes: user.dislikes,
        likes: user.likes,
        expectations: user.expectations,
        yourKindOfPartner: user.yourKindOfPartner,
        yourIdealPartner: user.yourIdealPartner,
        profilePhotos: user.profilePhotos,
        timelinePhotos: user.timelinePhotos,
        followers: user.followers,
        following: user.following,
        messages: user.messages,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
  
      return res.status(200).json({
        status: "success",
        message: "Successfully signed in",
        token,
        user: userDetails,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  };
  
/////////////////////////// reques otp
  const requestOTP = async (req, res) => {
    const { email } = req.body;
  
    // Check if the email is provided
    if (!email) {
      return res.status(400).json({
        status: "failed",
        message: "Email cannot be blank",
      });
    }
  
    try {
      // Check if the user with the provided email exists and is unverified
      const existingUser = await User.findOne({ email, verifiedEmail: false });
  
      if (!existingUser) {
        return res.status(400).json({
          status: "failed",
          message: "User with the provided email not found or already verified.",
        });
      }
  
      // Regenerate a new OTP for the existing unverified user
      const otpCode = generateOTPCode();
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
  
      // Save the new OTP code to the database
      const newOTPCode = new OTPCode({
        userId: existingUser._id,
        code: otpCode,
        createdAt: Date.now(),
        expiresAt: expirationTime,
      });
      await newOTPCode.save();
  
      // Resend the OTP to the user's email
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: existingUser.email,
        subject: "Verify Your Email",
        html: `
            <h1>Email Verification</h1>
            <p><strong>${otpCode}</strong></p>
            <p>Please enter the verification code in your account settings to verify your email.</p>
          `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            status: "failed",
            message: "An error occurred while resending the verification code.",
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            status: "success",
            message:
              "Verification code has been resent. Please check your email.",
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        message: "An error occurred while resending the verification code.",
      });
    }
  };
  
  ///////////////////verify otp
  const verifyOTP = async (req, res) => {
    // Extract the userId and the verification code from the request body
    const { userId, verificationCode } = req.body;
  
    try {
      const otpCodeRecord = await OTPCode.findOne({ userId });
  
      if (!otpCodeRecord) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid verification code.",
        });
      }
  
      if (otpCodeRecord.expiresAt < Date.now()) {
        await OTPCode.deleteOne({ userId });
        return res.status(400).json({
          status: "failed",
          message: "Verification code has expired. Please request a new one.",
        });
      }
  
      const isMatch = verificationCode === otpCodeRecord.code;
  
      if (!isMatch) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid verification code.",
        });
      }
  
      // Mark the user as verified (you can add this field to your User model)
      await User.updateOne({ _id: userId }, { verifiedEmail: true });
  
      // Retrieve the user data after successful account verification
      const user = await User.findOne({ _id: userId });
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC_KEY, {
        expiresIn: "24h",
      });
  
      return res.status(200).json({
        status: "success",
        message: "Account verification successful.",
        token,
        user,
      });
    } catch (error) {
      console.error("Error while verifying the account:", error);
      return res.status(500).json({
        status: "failed",
        message: "An error occurred while verifying the account.",
      });
    }
  };
  
  /////// CHNGE PASSWORD
  const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; // Make sure 'userId' matches the property name in req.user
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found. Please log in again.',
        });
      }
  
      // Verify the current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({
          status: 'failed',
          message: 'Invalid current password. Please enter the correct password.',
        });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully.',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  
  
  const authController = {
    loginUser,
    registerUser,
    requestOTP,
    verifyOTP,
    changePassword,
  };
  
  module.exports = authController;