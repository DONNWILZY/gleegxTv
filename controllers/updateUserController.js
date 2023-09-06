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
  

  ////// UPDATE ONLY PERSONAL INFORMATION
  const updatePersonalInfo = async (req, res) => {
    try {
      // Find the user by their ID
      const user = await User.findById(req.user.userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found. Please log in again.',
        });
      }
  
      // Extract only the fields related to personal information from the request body
      const {
        firstName,
        lastName,
        gender,
        dob,
        relationshipStatus,
        placeOfOrigin,
        resident,
        academic,
        employment,
        interestedIn,
        lookingFor,
        bio,
        profilePhotos,
        timelinePhotos,
        redFlags,
        dealBreaker,
        dislikes,
        likes,
        expectations,
        yourKindOfPartner,
        yourIdealPartner,
      } = req.body;
  
      // Update the user's personal information
      user.firstName = firstName;
      user.lastName = lastName;
      user.gender = gender;
      user.dob = dob;
      user.relationshipStatus = relationshipStatus;
      user.placeOfOrigin = placeOfOrigin;
      user.resident = resident;
      user.academic = academic;
      user.employment = employment;
      user.interestedIn = interestedIn;
      user.lookingFor = lookingFor;
      user.bio = bio;
      user.profilePhotos = profilePhotos;
      user.timelinePhotos = timelinePhotos;
      user.redFlags = redFlags;
      user.dealBreaker = dealBreaker;
      user.dislikes = dislikes;
      user.likes = likes;
      user.expectations = expectations;
      user.yourKindOfPartner = yourKindOfPartner;
      user.yourIdealPartner = yourIdealPartner;
  
      // Save the updated user information
      await user.save();
  
      // Fetch the updated user data after saving
      const updatedUser = await User.findById(req.user.userId).select('-password');
  
      // Return the updated user data in the response without the password
      return res.status(200).json({
        status: 'success',
        message: 'Personal information updated successfully.',
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  
  ///////// ADD PRIMARY SHOOL
  const addPrimarySchool = async (userId, schoolData) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Create a new primary school object
      const newSchool = {
        name: schoolData.name,
        yearOfStarting: schoolData.yearOfStarting,
        yearOfGraduation: schoolData.yearOfGraduation,
      };
  
      // Add the new primary school to the user's academic.primarySchools array
      user.academic.primarySchools.push(newSchool);
  
      // Save the user document
      await user.save();
  
      return user.academic.primarySchools;
    } catch (error) {
      throw error;
    }
  };

  ///// EDIT PRIMARY SCHOOL
  const editPrimarySchool = async (userId, schoolId, updatedSchoolData) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Find the primary school in the user's academic.primarySchools array
      const school = user.academic.primarySchools.id(schoolId);
  
      if (!school) {
        throw new Error('Primary school not found');
      }
  
      // Update the school's data
      school.name = updatedSchoolData.name;
      school.yearOfStarting = updatedSchoolData.yearOfStarting;
      school.yearOfGraduation = updatedSchoolData.yearOfGraduation;
  
      // Save the user document
      await user.save();
  
      return user.academic.primarySchools;
    } catch (error) {
      throw error;
    }
  };
  

  ///// DELETE PRIMARY SCHOOOL
  const deletePrimarySchool = async (userId, schoolId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Find and remove the primary school from the user's academic.primarySchools array
      const school = user.academic.primarySchools.id(schoolId);
  
      if (!school) {
        throw new Error('Primary school not found');
      }
  
      school.remove();
  
      // Save the user document
      await user.save();
  
      return user.academic.primarySchools;
    } catch (error) {
      throw error;
    }
  };
  

  ///// GET PRIMARY SCHOOLS getUserPrimarySchools
  // Assuming you have the User model defined as 'User' and primary schools are stored within the 'academic' field
const getUserPrimarySchools = async (req, res) => {
    try {
      const userId = req.params.userId; // Extract the user ID from the request parameters
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found.',
        });
      }
  
      const primarySchools = user.academic.primarySchools; // Get the primary schools from the user's academic field
  
      return res.status(200).json({
        status: 'success',
        message: 'Primary schools retrieved successfully.',
        primarySchools,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  
  

  //////VIEW HIGHT SCHOOL
  const viewHighSchools = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found.',
        });
      }
  
      const highSchools = user.academic.highSchools;
  
      return res.status(200).json({
        status: 'success',
        message: 'High schools retrieved successfully.',
        highSchools,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  
  ////// ADD HIGHT SCHOOL
  const addHighSchool = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, yearOfEntry, yearOfGraduation } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found.',
        });
      }
  
      const newHighSchool = {
        name,
        yearOfEntry,
        yearOfGraduation,
      };
  
      user.academic.highSchools.push(newHighSchool);
      await user.save();
  
      return res.status(201).json({
        status: 'success',
        message: 'High school added successfully.',
        highSchool: newHighSchool,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  
  ////// FELETE HIGH SCHOOL
  const editHighSchool = async (req, res) => {
    try {
      const userId = req.params.userId;
      const highSchoolId = req.params.highSchoolId;
      const { name, yearOfEntry, yearOfGraduation } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found.',
        });
      }
  
      const highSchool = user.academic.highSchools.id(highSchoolId);
  
      if (!highSchool) {
        return res.status(404).json({
          status: 'failed',
          message: 'High school not found.',
        });
      }
  
      highSchool.name = name;
      highSchool.yearOfEntry = yearOfEntry;
      highSchool.yearOfGraduation = yearOfGraduation;
  
      await user.save();
  
      return res.status(200).json({
        status: 'success',
        message: 'High school edited successfully.',
        highSchool,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  
  ////// DELETE HIFGH SCJOOL
  const deleteHighSchool = async (req, res) => {
    try {
      const userId = req.params.userId;
      const highSchoolId = req.params.highSchoolId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found.',
        });
      }
  
      const highSchool = user.academic.highSchools.id(highSchoolId);
  
      if (!highSchool) {
        return res.status(404).json({
          status: 'failed',
          message: 'High school not found.',
        });
      }
  
      highSchool.remove();
      await user.save();
  
      return res.status(200).json({
        status: 'success',
        message: 'High school deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while processing your request.',
      });
    }
  };
  

  const updateUserController = {
    updateUser,
    updatePersonalInfo,
    addPrimarySchool,
    editPrimarySchool,
    deletePrimarySchool,
    getUserPrimarySchools,
    viewHighSchools,
    editHighSchool,
    deleteHighSchool,
    addHighSchool

  };

  module.exports = updateUserController;