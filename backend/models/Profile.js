const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  fullName: String,
  avatarUrl: String,
  bio:       String,
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
