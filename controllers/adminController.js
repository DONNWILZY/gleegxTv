const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
//const createError = require ('../utilities/');
const User = require ('../models/User');
const transporter = require('../utilities/transporter'); // Import your nodemailer transporter

/////// ADMIN TO ADD USER AND USER ROLE
const addUserByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Find the user with the specified ID
    const adminUser = await User.findById(adminId);

    if (!adminUser || adminUser.role !== 'isAdmin') {
      return res.status(403).json({
        status: 'failed',
        message: 'Access denied. Only admins can add users.',
      });
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      username,
      verifiedEmail,
      role,
    } = req.body;

    // Hash the password using bcrypt
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the provided data
    const newUser = new User({
      firstName,
      lastName,
      email,
      verifiedEmail,
      phoneNumber,
      password: hashedPassword, // Use the hashed password
      username,
      role,
      createdBy: [
        {
          admin: adminUser._id,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          content: 'User account created by admin.',
        },
      ],
    });

    // Save the new user to the database
    await newUser.save();

    // Send an email for email verification
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Account Verification',
      html: `
        <h1>Email Verification</h1>
        <p> Welcome ${lastName} our dear ${role}. Your password is: ${password} and username: ${username} </p>
        <p>Kindly Login to update your account and change your password</a></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully by admin. Verification email sent.',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'failed',
      message: 'An error occurred while adding the user.',
    });
  }
};





  
 






const adminController = {
    addUserByAdmin,
  };

  module.exports = adminController;