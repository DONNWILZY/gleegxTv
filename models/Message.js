const mongoose = require('mongoose');

// Define the messaging schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread',
  },
  attachments: [
    {
      url: String,      // URL or path to the attachment
      filename: String, // Original filename
      contentType: String, // MIME type of the attachment
    },
  ],
  // Add other fields as needed
});

// Create a Message model using the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
