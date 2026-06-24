const express = require('express');
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const path = require('path');
const { fetchMovieById, fetchTvById } = require('../utils/api');
const { checkMilestones } = require('../services/achievements');

const router = express.Router();
let upload;
try {
  const { upload: cloudinaryUpload } = require('../utils/cloudinary');
  upload = cloudinaryUpload;
} catch (error) {
  upload = {
    single: () => (req, res, next) => res.status(503).json({ error: 'Avatar upload unavailable' }),
  };
}

const validate = (schema, type = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) return res.status(400).json({ error: error.message });
  next();
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

// Avatar upload via Cloudinary
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const avatarUrl = req.file.path; // Cloudinary returns the URL in req.file.path
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
  
  // Check milestones
  await checkMilestones(req.user._id, 'WATCH');

  res.json({ message: 'Viewing history updated' });
});

router.get('/viewing-history/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select('viewingHistory');
  // Return recent sorted
  const history = user.viewingHistory.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
  res.json({ items: history });
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('viewingHistory');
    if (!user || !user.viewingHistory) return res.json({ totalWatchTime: 0, topGenres: [] });

    let totalWatchTime = 0;
    const genreCounts = {};

    // Parallel fetch for details
    await Promise.all(
      user.viewingHistory.map(async (item) => {
        try {
          const media = item.mediaType === 'tv' 
            ? await fetchTvById(item.movieId) 
            : await fetchMovieById(item.movieId);
            
          if (!media) return;

          // calculate runtime
          if (item.mediaType === 'tv') {
            const episodes = media.number_of_episodes || 1;
            const episodeRuntime = (media.episode_run_time && media.episode_run_time[0]) || 45;
            totalWatchTime += (episodes * episodeRuntime);
          } else {
            totalWatchTime += (media.runtime || 0);
          }

          // calculate genres
          if (media.genres && Array.isArray(media.genres)) {
            media.genres.forEach(g => {
              if (!genreCounts[g.name]) genreCounts[g.name] = 0;
              genreCounts[g.name] += 1;
            });
          }
        } catch (e) {
          // ignore fetch errors for individual items
        }
      })
    );

    const sortedGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 genres

    res.json({
      totalWatchTime, // in minutes
      topGenres: sortedGenres,
      moviesWatched: user.viewingHistory.filter(h => h.mediaType === 'movie' || !h.mediaType).length,
      tvShowsWatched: user.viewingHistory.filter(h => h.mediaType === 'tv').length,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
