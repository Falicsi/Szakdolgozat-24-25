const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  fullName: String,
  avatarUrl: String,
  bio: String,
}, { timestamps: true });

module.exports = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
