const express = require('express');
const authMiddleware = require('../middleware/auth');
const Review = require('../models/Review');
const Activity = require('../models/Activity');
const { checkMilestones } = require('../services/achievements');

const router = express.Router();

// list reviews (paginated)
router.get('/:movieId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const movieId = Number(req.params.movieId);
    const mediaType = req.query.mediaType || 'movie';

    const [items, total] = await Promise.all([
      Review.find({ movieId, mediaType })
        .populate('user', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ movieId, mediaType }),
    ]);
    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Aggregate summary (avg + distribution)
router.get('/:movieId/summary', async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);
    const mediaType = req.query.mediaType || 'movie';
    const [summary] = await Review.aggregate([
      { $match: { movieId, mediaType } },
      {
        $group: {
          _id: '$movieId',
          count: { $sum: 1 },
          avg: { $avg: '$rating' },
          dist1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          dist2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          dist3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          dist4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          dist5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        },
      },
      { $project: { _id: 0 } },
    ]);

    res.json(
      summary || {
        count: 0,
        avg: 0,
        dist1: 0,
        dist2: 0,
        dist3: 0,
        dist4: 0,
        dist5: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review summary' });
  }
});

// create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movieId, rating , comment, mediaType = 'movie' } = req.body;
    const numMovieId = Number(movieId);
    const numRating = Number(rating);

    if(!Number.isFinite(numMovieId)) return res.status(400).json({ error: 'Invalid movieId'});
    
    if(!Number.isFinite(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5 '});
    }
    if(comment && typeof comment !== 'string') return res.status(400).json({ error: 'Invalid comment'});

    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user.userId, movieId: numMovieId, mediaType });
    if (existing) {
      existing.rating = numRating;
      if (comment !== undefined) existing.comment = comment.trim();
      await existing.save();
      return res.status(200).json(existing);
    }

    const review = new Review({
      movieId: numMovieId,
      mediaType,
      rating: numRating,
      comment: (comment) || ''.trim(),
      user: req.user.userId,
    });

    await review.save();
    
    // Create activity
    try {
      await Activity.create({
        user: req.user.userId,
        type: 'USER_RATED_MOVIE',
        mediaId: numMovieId,
        mediaType,
        rating: numRating,
      });
    } catch (actErr) {
      console.error('Failed to create review activity:', actErr);
    }
    
    // Check milestones
    await checkMilestones(req.user.userId, 'REVIEW');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;