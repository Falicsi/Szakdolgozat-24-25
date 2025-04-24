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
    type: String, // később lehet ObjectId is, ha van User modell
    required: true
  },
  invitedUsers: {
    type: [String], // e-mail címek vagy user ID-k tömbje
    default: []
  }
});

module.exports = mongoose.model('Event', eventSchema);
