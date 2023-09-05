const mongoose = require('mongoose');

// Define the Time Slot schema
const timeSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue', // Reference to the venue where the blind date will take place
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  // Add other fields as needed, such as participant details, price, etc.
});

// Create a TimeSlot model using the schema
const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
