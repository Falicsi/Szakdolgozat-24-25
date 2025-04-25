const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true,
    unique: true       // egy userhez csak egy profil tartozhat
  },
  avatarUrl: {
    type: String,
    default: ''        // link a profilképre
  },
  bio: {
    type: String,
    default: ''        // rövid bemutatkozó szöveg
  },
  timezone: {
    type: String,
    default: 'UTC'     // pl. 'Europe/Budapest'
  }
}, {
  timestamps: true     // createdAt, updatedAt
});

module.exports = mongoose.model('Profile', ProfileSchema);
