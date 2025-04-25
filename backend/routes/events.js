// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Invitation = require('../models/Invitation');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events – új esemény
// router.post('/', auth, async (req, res) => {
router.post('/', async (req, res) => { // <-- auth törölve
  try {
    // Destructuring és alapértelmezett értékek
    const {
      title,
      description = '',
      category,
      resource,
      start,
      end,
      createdBy,
      invitedUsers = []
    } = req.body;

    // Egyszerű validáció
    if (!title || !start || !createdBy) {
      return res.status(400).json({ message: 'title, start és createdBy mezők kötelezők' });
    }

    // Build evData objektum csak a megadott mezőkkel
    const evData = { title, description, start, end, createdBy, invitedUsers };
    if (category) evData.category = category;
    if (resource) evData.resource = resource;

    // Mentés
    const ev = new Event(evData);
    const saved = await ev.save();

    // Automatikus invitation + notification
    await Promise.all(invitedUsers.map(async userId => {
      await Invitation.create({
        eventId: saved._id,
        userId,
        status: 'pending'
      });
      await Notification.create({
        userId,
        eventId: saved._id,
        type: 'invitation',
        message: `You have been invited to "${saved.title}".`
      });
    }));

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/events/:id – esemény frissítése
router.put('/:id', auth, async (req, res) => {
  try {
    // Lekérjük a korábbi eseményt
    const oldEv = await Event.findById(req.params.id);
    if (!oldEv) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Destructuring és alapértelmezett értékek
    const {
      title,
      description = '',
      category,
      resource,
      start,
      end,
      invitedUsers = []
    } = req.body;

    // Validáció
    if (!title || !start) {
      return res.status(400).json({ message: 'title és start mezők kötelezők' });
    }

    // Update data csak a megadott mezőkkel
    const updateData = { title, description, start, end, invitedUsers };
    if (category) updateData.category = category;
    if (resource) updateData.resource = resource;

    // Mentés
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Új meghívottak azonosítása
    const newlyAdded = invitedUsers.filter(
      uid => !oldEv.invitedUsers.includes(uid)
    );
    await Promise.all(newlyAdded.map(async userId => {
      await Invitation.create({
        eventId: updated._id,
        userId,
        status: 'pending'
      });
      await Notification.create({
        userId,
        eventId: updated._id,
        type: 'invitation',
        message: `You have been invited to "${updated.title}".`
      });
    }));

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
