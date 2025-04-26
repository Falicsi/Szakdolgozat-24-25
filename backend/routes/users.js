const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Role    = require('../models/Role');
const auth    = require('../middleware/auth');
const permit  = require('../middleware/permit');

// Admin-only: szerepkör hozzárendelése felhasználóhoz
// PATCH /api/users/:id/role
router.patch('/:id/role', auth, permit('admin'), async (req, res) => {
  const { roleName } = req.body;
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    return res.status(400).json({ message: 'Role not found' });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: role._id },
    { new: true }
  ).populate('role', 'name');
  res.json(user);
});

module.exports = router;
