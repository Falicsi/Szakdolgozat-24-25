const express      = require('express');
const router       = express.Router();
const Notification = require('../models/Notification');
const auth         = require('../middleware/auth');

// GET /api/notifications?userId=...&unreadOnly=true
router.get('/', auth, async (req, res) => {
  try {
    const filter = { userId: req.query.userId };
    if (req.query.unreadOnly === 'true') filter.read = false;
    const notifs = await Notification.find(filter)
      .sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notifications
router.post('/', auth, async (req, res) => {
  try {
    const notif = new Notification({
      userId:  req.body.userId,
      eventId: req.body.eventId,
      type:    req.body.type,
      message: req.body.message
    });
    const saved = await notif.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/notifications/:id/read – jelöljük olvasottnak
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
