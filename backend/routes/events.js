// routes/events.js
const express = require('express');
const router  = express.Router();
const Event   = require('../models/Event');

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  const { title, start, end } = req.body;
  const event = new Event({ title, start, end });
  try {
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/events/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Törölve' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
