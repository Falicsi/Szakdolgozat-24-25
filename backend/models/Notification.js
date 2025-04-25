const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Event'
  },
  type: {
    type: String,
    enum: ['event_created', 'event_updated', 'event_deleted', 'invitation'],
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexeljük a userId + read kombinációt a gyors lekérésekhez
NotificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
