const express  = require('express');
const router   = express.Router();
const Resource = require('../models/Resource');
const auth     = require('../middleware/auth');

// GET /api/resources – összes forrás lista
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const list = await Resource.find(filter).sort('name');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/resources/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const r = await Resource.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Resource not found' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/resources – új forrás létrehozása
router.post('/', auth, async (req, res) => {
  try {
    const r = new Resource({
      name:        req.body.name,
      type:        req.body.type,
      capacity:    req.body.capacity,
      location:    req.body.location,
      description: req.body.description
    });
    const saved = await r.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/resources/:id – forrás módosítása
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        name:        req.body.name,
        type:        req.body.type,
        capacity:    req.body.capacity,
        location:    req.body.location,
        description: req.body.description
      },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/resources/:id – forrás törlése
router.delete('/:id', auth, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
