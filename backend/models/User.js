const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: null
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },
});

userSchema.virtual('profileData', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON',   { virtuals: true });

// Middleware: profil létrehozása user mentése után, ha még nincs
userSchema.post('save', async function(doc, next) {
  try {
    const existing = await Profile.findOne({ user: doc._id });
    if (!existing) {
      await Profile.create({ user: doc._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
