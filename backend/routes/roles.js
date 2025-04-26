const express = require('express');
const router  = express.Router();
const Role    = require('../models/Role');
const auth    = require('../middleware/auth');
const permit = require('../middleware/permit');

// Mindenki lekérheti a szerepköröket
router.get('/', auth, async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

// ADMIN-only: új szerepkör létrehozása
router.post('/', auth, permit('admin'), async (req, res) => {
  const { name, description } = req.body;
  const role = new Role({ name, description });
  await role.save();
  res.status(201).json(role);
});

// POST /api/roles – új szerepkör
router.post('/', auth, async (req, res) => {
  try {
    const role = new Role({
      name:        req.body.name,
      description: req.body.description || ''
    });
    const saved = await role.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/roles/:id – módosítás
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Role.findByIdAndUpdate(
      req.params.id,
      {
        name:        req.body.name,
        description: req.body.description || ''
      },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/roles/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
