const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['admin', 'organizer', 'user'],
    unique: true,
    required: true
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
