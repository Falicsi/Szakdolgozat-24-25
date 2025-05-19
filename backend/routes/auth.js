const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Az email cím már használatban van!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    if (savedUser) {
      res.status(201).json({ message: 'Sikeres regisztráció!' });
    } else {
      res.status(500).json({ message: 'Hiba történt a felhasználó mentésekor!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hiba történt a regisztráció során!' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('role', 'name');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a felhasználók lekérésekor!' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).populate('role', 'name');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Ha nincs szerepkör, dinamikusan hozzárendeljük az "organizer" role-t
    if (!user.role) {
      const Role = require('../models/Role');
      const organizerRole = await Role.findOne({ name: 'organizer' });
      if (organizerRole) {
        user.role = organizerRole._id;
        await user.save();
        // Újratöltjük a user-t populate-tal
        user = await User.findOne({ email }).populate('role', 'name');
      } else {
        return res.status(500).json({ message: 'Organizer szerepkör nem található!' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        roleName: user.role.name
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
      userId: user._id.toString(),
      roleName: user.role.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', auth, async (req, res) => {
  if (req.params.id === req.userId) {
    return res.status(403).json({ message: 'Nem törölheted saját fiókodat' });
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Felhasználó törölve' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/users/:id – felhasználó frissítése
router.put('/users/:id', auth, async (req, res) => {
  if (req.params.id === req.userId) {
    return res.status(403).json({ message: 'Nem módosíthatod saját fiókodat' });
  }
  const { username, email, password } = req.body;
  const updates = { username, email };
  try {
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json({
      _id: updated._id,
      username: updated.username,
      email: updated.email
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
