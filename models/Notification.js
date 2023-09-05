const mongoose = require('mongoose');

// Define the Notification schema
const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who sent the notification
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who will receive the notification
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notificationType: {
    type: String,
    enum: ['matching', 'bookingConfirmation', 'other'], // Add more types as needed
    required: true,
  },
  // Add other fields as needed
});

// Create a Notification model using the schema
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
