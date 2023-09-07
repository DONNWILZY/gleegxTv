const mongoose = require('mongoose');
const moment = require('moment');
//const createError = require ('../utilities/createError');
const User = require ('../models/User');


const followUser = async (req, res) => {
  const userId = req.user.userId; // The user performing the follow action
  const followedUserId = req.params.userId; // The user to be followed

  try {
    // Check if the user is already following the target user
    const user = await User.findById(userId);
    const followedUser = await User.findById(followedUserId);

    if (!user || !followedUser) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found.',
      });
    }

    if (user.following.includes(followedUserId)) {
      return res.status(400).json({
        status: 'failed',
        message: 'You are already following this user.',
      });
    }

    // Add the target user to the "following" list of the current user
    user.following.push(followedUserId);

    // Add the current user to the "followers" list of the target user
    followedUser.followers.push(userId);

    await Promise.all([user.save(), followedUser.save()]);

    return res.status(200).json({
      status: 'success',
      message: 'You are now following this user.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'failed',
      message: 'An error occurred while processing your request.',
    });
  }
};


const unfollowUser = async (req, res) => {
  const userId = req.user.userId; // The user performing the unfollow action
  const unfollowedUserId = req.params.userId; // The user to be unfollowed

  try {
    // Check if the user is following the target user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found.',
      });
    }

    if (!user.following.includes(unfollowedUserId)) {
      return res.status(400).json({
        status: 'failed',
        message: 'You are not following this user.',
      });
    }

    // Remove the target user from the "following" list of the current user
    user.following = user.following.filter((id) => id.toString() !== unfollowedUserId);
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'You have unfollowed this user.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'failed',
      message: 'An error occurred while processing your request.',
    });
  }
};







const connectControllers = {
  unfollowUser,
  followUser

  };

  module.exports = connectControllers;