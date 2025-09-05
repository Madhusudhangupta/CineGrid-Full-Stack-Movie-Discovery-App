
const express = require('express');
const authMiddleware = require('../middleware/auth');
const Recommendation = require('../models/Recommendation');
const { fetchMovieById } = require('../utils/api');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ user: req.user.userId });
    const movieDetails = await Promise.all(
      recommendations.map(async (rec) => {
        const movie = await fetchMovieById(rec.movieId);
        return { ...rec.toObject(), movie };
      })
    );
    res.json(movieDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { movieId, reason } = req.body;
  try {
    const recommendation = new Recommendation({
      movieId,
      reason,
      user: req.user.userId,
    });
    await recommendation.save();
    const movie = await fetchMovieById(movieId);
    res.status(201).json({ ...recommendation.toObject(), movie });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create recommendation' });
  }
});

module.exports = router;