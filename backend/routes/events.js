// backend/routes/events.js
const express      = require('express');
const router       = express.Router();
const Event        = require('../models/Event');
const Invitation   = require('../models/Invitation');
const Notification = require('../models/Notification');
const User         = require('../models/User');
const auth         = require('../middleware/auth');

// POST /api/events – új esemény létrehozása
router.post('/', auth, async (req, res) => {
  try {
    // Csak organizer vagy admin hozhat létre eseményt
    const role = req.user?.roleName;
    if (role !== 'organizer' && role !== 'admin') {
      return res.status(403).json({ message: 'Nincs jogosultság esemény létrehozásához.' });
    }

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

    // Szervező invitation (userId = createdBy)
    await Invitation.create({
      eventId: saved._id,
      userId:  createdBy,
      status:  'accepted'
    });

    // Meghívottak invitation-jei (emailből userId-t keresünk)
    const others = invitedUsers.filter(email => email !== createdBy);
    const users = await User.find({ email: { $in: others } });

    await Promise.all(users.map(async user => {
      await Invitation.create({
        eventId: saved._id,
        userId:  user._id.toString(),
        status: 'pending'
      });
      await Notification.create({
        userId: user._id.toString(),
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

    // Meghívottak e-mailjeiből userId-k keresése
    const others = invitedUsers.filter(email => email !== oldEv.createdBy);
    const users = await User.find({ email: { $in: others } });
    const userIds = users.map(u => u._id.toString());

    // Meghívottak Invitation-jei az eseményhez
    const existingInvs = await Invitation.find({ eventId: updated._id });
    const alreadyInvitedIds = existingInvs.map(inv => inv.userId);

    // Új meghívottak (akik most kerültek be)
    const newlyAdded = userIds.filter(uid => !alreadyInvitedIds.includes(uid));
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

    // Meghívottak, akiket eltávolítottak (már nincs az invitedUsers-ben)
    const removed = alreadyInvitedIds.filter(uid => !userIds.includes(uid));
    await Invitation.deleteMany({
      eventId: updated._id,
      userId: { $in: removed }
    });

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

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Töröld a kapcsolódó invitation-öket is, ha kell:
    await Invitation.deleteMany({ eventId: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
