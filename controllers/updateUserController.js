const mongoose = require('mongoose');
const moment = require('moment');
//const createError = require ('../utilities/createError');
const User = require ('../models/User');




////// UPDATdate all user fields 
const updateUser = async (req, res) => {
    try {
      // Find the user by their ID
      const user = await User.findById(req.user.userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found. Please log in again.',
        });
      }
  
      // Update user information
      user.set(req.body);
      await user.save();
  
      // Exclude the "password" field from the response
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
        // Exclude the "password" field
      };
  
      return res.status(200).json({
        status: 'success',
        message: 'User information updated successfully.',
        user: userDetails,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  
  

  const updateUserController = {
    updateUser
  };

  module.exports = updateUserController;