const express = require('express');
const authMiddleware = require('../middleware/auth');
const Recommendation = require('../models/Recommendation');
const { fetchMovieById, fetchTvById } = require('../utils/api');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const recs = await Recommendation.find({ user: req.user.userId }).sort({ createdAt: -1 });
    const items = await Promise.all(
      recs.map(async (rec) => {
        const item = rec.mediaType === 'tv' 
          ? await fetchTvById(rec.movieId)
          : await fetchMovieById(rec.movieId);
        return { ...item, reason: rec.reason };
      })
    );
    res.json(items.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movieId, reason, mediaType = 'movie' } = req.body;
    
    // Admin only or internal logic usually generates recommendations
    // For now, allow user to generate their own (mock behavior)
    
    const rec = new Recommendation({
      user: req.user.userId,
      movieId,
      mediaType,
      reason
    });
    await rec.save();

    const item = mediaType === 'tv' 
      ? await fetchTvById(movieId)
      : await fetchMovieById(movieId);
    
    res.json({ ...item, reason });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create recommendation' });
  }
});

module.exports = router;