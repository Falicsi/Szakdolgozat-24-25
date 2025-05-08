// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Category',
    required: true
  },
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  }],
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
  invitedUsers: [{ type: String }] // <-- E-mail címek tömbje
});

module.exports = mongoose.model('Event', eventSchema);
