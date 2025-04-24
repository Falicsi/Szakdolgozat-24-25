// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    required: true
  },
  invitedUsers: {
    type: [String], 
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
