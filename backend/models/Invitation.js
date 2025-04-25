const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, {
  timestamps: true
});

InvitationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Invitation', InvitationSchema);
