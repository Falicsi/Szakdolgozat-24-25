const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

// Saját profil lekérése
router.get('/', auth, async (req, res) => {
  const userId = req.user.userId;
  const profile = await Profile.findOne({ userId }).populate('userId', 'email username');
  if (!profile) return res.status(404).json({ message: 'No profile found' });
  res.json(profile);
});

// Saját profil létrehozása / frissítése
router.put('/', auth, async (req, res) => {
  const userId = req.user.userId;
  const data = {
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    bio: req.body.bio
  };
  let profile = await Profile.findOneAndUpdate(
    { userId },
    data,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  // User.profile mezőbe is beírjuk, ha még nem volt
  const User = require('../models/User');
  await User.findByIdAndUpdate(userId, { profile: profile._id });
  res.json(profile);
});

// POST /api/profiles – új profil létrehozása
router.post('/', auth, async (req, res) => {
  try {
    const exists = await Profile.findOne({ userId: req.body.userId });
    if (exists) {
      return res.status(400).json({ message: 'Profile already exists' });
    }
    const p = new Profile({
      userId: req.body.userId,
      avatarUrl: req.body.avatarUrl || '',
      bio: req.body.bio || '',
      timezone: req.body.timezone || 'UTC'
    });
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/profiles/:userId – profil törlése
router.delete('/:userId', auth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
