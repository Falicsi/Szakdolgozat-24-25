// backend/models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,      // ne legyen két ugyanolyan kategória
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Gyors kereséshez indexelés névre
CategorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', CategorySchema);
