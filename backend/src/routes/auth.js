const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found '});
    return res.json({ user });
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch user'});
  }
})

router.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    name,
  } = req.body || {};
  try {
    const normalizedFirstName = (firstName || '').trim() || (name ? String(name).trim().split(/\s+/)[0] : '');
    const normalizedLastName = (lastName || '').trim() || (name ? String(name).trim().split(/\s+/).slice(1).join(' ') : '');
    const normalizedUsername = String(username || '').trim().toLowerCase();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const user = new User({
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    if (error?.code === 11000) {
      const key = Object.keys(error?.keyValue || error?.keyPattern || {})[0];
      if (key === 'email') return res.status(409).json({ error: 'Email already registered' });
      if (key === 'username') return res.status(409).json({ error: 'Username already taken' });
      return res.status(409).json({ error: 'Duplicate field value' });
    }
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors || {}).map((e) => e.message).filter(Boolean);
      return res.status(400).json({
        error: details[0] || 'Invalid registration data',
        details,
      });
    }
    res.status(500).json({ error: 'Registration failed', message: error?.message });
  }
});

router.post('/login', async (req, res) => {
  const { identifier, email, username, password } = req.body;
  try {
    const rawIdentifier = String(identifier || email || username || '').trim();
    if (!rawIdentifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const normalized = rawIdentifier.toLowerCase();
    const query = rawIdentifier.includes('@')
      ? { email: normalized }
      : { username: normalized };

    const user = await User.findOne(query).select('+password');
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
