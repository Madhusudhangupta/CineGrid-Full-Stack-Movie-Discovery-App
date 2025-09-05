const express = require('express');
const authMiddleware = require('../middleware/auth');
const Review = require('../models/Review');
const router = express.Router();

router.get('/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  try {
    const review = new Review({
      movieId,
      rating,
      comment,
      user: req.user.userId,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;