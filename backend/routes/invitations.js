const express    = require('express');
const router     = express.Router();
const Invitation = require('../models/Invitation');
const auth       = require('../middleware/auth');

// GET /api/invitations?eventId=... vagy ?userId=...
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.userId)  filter.userId  = req.query.userId;
    const invs = await Invitation.find(filter).populate('eventId'); // .populate('userId') törölve
    res.json(invs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/invitations
router.post('/', auth, async (req, res) => {
  try {
    const inv = new Invitation({
      eventId: req.body.eventId,
      userId:  req.body.userId,
      status:  req.body.status || 'pending'
    });
    const saved = await inv.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/invitations/:id – státusz módosítása
router.patch('/:id', auth, async (req, res) => {
  try {
    const inv = await Invitation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(inv);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/invitations/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Invitation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invitation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/invitations?eventId=... vagy ?userId=...
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.userId)  filter.userId  = req.query.userId;
    const invs = await Invitation.find(filter).populate('eventId');
    res.json(invs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
