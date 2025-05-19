const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['room', 'virtual', 'equipment'],
    required: true
  },
  capacity: {
    type: Number,
    default: 1,
    min: 1
  },
  location: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Gyors keresés névre és típusra
//ResourceSchema.index({ name: 1 });
ResourceSchema.index({ type: 1 });

module.exports = mongoose.model('Resource', ResourceSchema);
