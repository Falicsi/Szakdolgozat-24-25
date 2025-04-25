const express = require('express');
const router  = express.Router();
const Profile = require('../models/Profile');
const auth    = require('../middleware/auth');

// GET /api/profiles/:userId – egy user's profil lekérése
router.get('/:userId', auth, async (req, res) => {
  try {
    const p = await Profile.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ message: 'Profile not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profiles – új profil létrehozása
router.post('/', auth, async (req, res) => {
  try {
    const exists = await Profile.findOne({ userId: req.body.userId });
    if (exists) {
      return res.status(400).json({ message: 'Profile already exists' });
    }
    const p = new Profile({
      userId:    req.body.userId,
      avatarUrl: req.body.avatarUrl || '',
      bio:       req.body.bio       || '',
      timezone:  req.body.timezone  || 'UTC'
    });
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/profiles/:userId – profil módosítása (upsert is lehet)
router.put('/:userId', auth, async (req, res) => {
  try {
    const updates = {
      avatarUrl: req.body.avatarUrl,
      bio:       req.body.bio,
      timezone:  req.body.timezone
    };
    const opts = { new: true, upsert: true, runValidators: true };
    const updated = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      updates,
      opts
    );
    res.json(updated);
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
