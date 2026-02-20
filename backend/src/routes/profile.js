const express = require('express');
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const path = require('path');

const router = express.Router();
let multer = null;
try {
  multer = require('multer');
} catch {
  multer = null;
}

const validate = (schema, type = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

// Avatar upload setup
const upload = multer
  ? multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/avatars/');
        },
        filename: (req, file, cb) => {
          const filename = `avatar-${Date.now()}${path.extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    })
  : {
      single: () => (req, res, next) => res.status(503).json({ error: 'Avatar upload unavailable' }),
    };

// Validation schemas
const updateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  bio: Joi.string().max(500),
  preferences: Joi.object({
    genres: Joi.array().items(Joi.number()),
    languages: Joi.array().items(Joi.string()),
    notifyOnRelease: Joi.boolean(),
    notifyOnRecommendation: Joi.boolean(),
    notifyOnComment: Joi.boolean(),
  }),
  privacy: Joi.object({
    profileVisibility: Joi.string().valid('public', 'private', 'friends'),
    showWatchlist: Joi.boolean(),
    showReviews: Joi.boolean(),
  }),
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('followers', 'name avatar')
    .populate('following', 'name avatar');
  res.json(user);
});

router.put('/me', authMiddleware, validate(updateSchema), async (req, res) => {
  const updates = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: 'Not Found' });
  Object.assign(user, updates);
  await user.save();
  const updatedUser = await User.findById(req.user._id).select('-password');
  res.json(updatedUser);
});

// Avatar upload
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const user = await User.findById(req.user._id);
  user.avatar = avatarUrl;
  await user.save();
  res.json({ avatar: avatarUrl });
});

// Viewing history
router.post('/viewing-history', authMiddleware, async (req, res) => {
  const { movieId } = req.body;
  const user = await User.findById(req.user._id);
  // Remove existing
  user.viewingHistory = user.viewingHistory.filter(item => item.movieId !== movieId);
  user.viewingHistory.push({ movieId, viewedAt: new Date() });
  await user.save();
  res.json({ message: 'Viewing history updated' });
});

router.get('/viewing-history/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select('viewingHistory');
  // Return recent sorted
  const history = user.viewingHistory.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
  res.json({ items: history });
});

module.exports = router;
