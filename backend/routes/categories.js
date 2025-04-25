// backend/routes/categories.js
const express  = require('express');
const router   = express.Router();
const Category = require('../models/Category');
const auth     = require('../middleware/auth');

// GET /api/categories – lista
router.get('/', auth, async (req, res) => {
  try {
    const cats = await Category.find().sort('name');
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories – új kategória
router.post('/', auth, async (req, res) => {
  try {
    const cat = new Category({
      name:        req.body.name,
      description: req.body.description || ''
    });
    const saved = await cat.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/categories/:id – módosítás
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
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

// DELETE /api/categories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
