// backend/routes/events.js
const express      = require('express');
const router       = express.Router();
const Event        = require('../models/Event');
const Invitation   = require('../models/Invitation');
const Notification = require('../models/Notification');
const auth         = require('../middleware/auth');

// POST /api/events – új esemény létrehozása
router.post('/', auth, async (req, res) => {
  try {
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

    if (!title || !start || !createdBy) {
      return res.status(400).json({ message: 'title, start és createdBy kötelező' });
    }

    // Esemény mentése
    const evData = { title, description, start, end, createdBy, invitedUsers };
    if (category) evData.category = category;
    if (resource) evData.resource = resource;

    const ev = new Event(evData);
    const saved = await ev.save();

    // 1) Szervező automatikus accepted meghívása
    await Invitation.create({
      eventId: saved._id,
      userId:  createdBy,
      status:  'accepted'
    });

    // 2) A többi meghívott pending státusszal
    const others = invitedUsers.filter(uid => uid !== createdBy);
    await Promise.all(others.map(async userId => {
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

    return res.status(201).json(saved);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// PUT /api/events/:id – esemény frissítése
router.put('/:id', auth, async (req, res) => {
  try {
    // Létező esemény lekérése
    const oldEv = await Event.findById(req.params.id);
    if (!oldEv) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const {
      title,
      description = '',
      category,
      resource,
      start,
      end,
      invitedUsers = []
    } = req.body;

    if (!title || !start) {
      return res.status(400).json({ message: 'title és start kötelező' });
    }

    // Esemény adatainak frissítése
    const updateData = { title, description, start, end, invitedUsers };
    if (category) updateData.category = category;
    if (resource) updateData.resource = resource;

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // 1) Szervező meghívásának ellenőrzése:
    // Ha még nincs Invitation createdBy-hoz, hozzuk létre accepted-ként
    const existsOrgInv = await Invitation.findOne({
      eventId: updated._id,
      userId:  oldEv.createdBy
    });
    if (!existsOrgInv) {
      await Invitation.create({
        eventId: updated._id,
        userId:  oldEv.createdBy,
        status:  'accepted'
      });
    }

    // 2) Új meghívottak kezelése (akik még nem voltak):
    const newlyAdded = invitedUsers.filter(
      uid => !oldEv.invitedUsers.includes(uid)
    ).filter(uid => uid !== oldEv.createdBy);

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

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// GET /api/events – összes esemény
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id – egy esemény
router.get('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
