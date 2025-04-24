const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'szakdolgozat';

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
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a felhasználók lekérésekor!' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
          { userId: user._id, email: user.email, username: user.username },
          JWT_SECRET,
          { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful', token, username: user.username });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/auth/users/:id – felhasználó törlése
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Felhasználó törölve' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/users/:id – felhasználó frissítése
router.put('/users/:id', async (req, res) => {
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
      _id:      updated._id,
      username: updated.username,
      email:    updated.email
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
