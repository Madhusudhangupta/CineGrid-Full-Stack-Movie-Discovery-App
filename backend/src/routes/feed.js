const express = require('express');
const authMiddleware = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { fetchMovieById, fetchTvById } = require('../utils/api');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get current user to find who they follow
    const currentUser = await User.findById(req.user._id).select('following');
    const followingIds = currentUser.following || [];

    // Also include own activities? Usually feeds include own + following. Let's include own for testing
    followingIds.push(req.user._id);

    const [activities, total] = await Promise.all([
      Activity.find({ user: { $in: followingIds } })
        .populate('user', 'name username avatar')
        .populate('listId', 'name description coverImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Activity.countDocuments({ user: { $in: followingIds } })
    ]);

    // Enhance activities with TMDB data if missing mediaTitle, but realistically we should fetch it on the fly or rely on client
    // For simplicity, let's fetch on the fly here to return full media objects
    const enrichedActivities = await Promise.all(
      activities.map(async (act) => {
        const actObj = act.toObject();
        if (act.mediaId) {
          try {
            if (act.mediaType === 'tv') {
              actObj.media = await fetchTvById(act.mediaId);
            } else {
              actObj.media = await fetchMovieById(act.mediaId);
            }
          } catch (e) {
             // Ignore if fetch fails
          }
        }
        return actObj;
      })
    );

    res.json({
      items: enrichedActivities,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Failed to fetch feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

module.exports = router;
