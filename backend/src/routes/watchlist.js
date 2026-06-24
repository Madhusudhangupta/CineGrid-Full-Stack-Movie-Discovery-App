
const express = require('express');
const authMiddleware = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');
const Activity = require('../models/Activity');
const { fetchMovieById, fetchTvById } = require('../utils/api');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.userId });
    if (!watchlist) return res.json([]);
    
    let itemsToFetch = watchlist.items || [];
    
    // Migrate legacy movies on read
    if (watchlist.movies && watchlist.movies.length > 0) {
      const existingIds = new Set(itemsToFetch.map(i => i.mediaId));
      watchlist.movies.forEach(id => {
        if (!existingIds.has(id)) {
          itemsToFetch.push({ mediaId: id, mediaType: 'movie' });
        }
      });
    }

    const fetchedItems = await Promise.all(
      itemsToFetch.map(async (item) => {
        if (item.mediaType === 'tv') {
          return await fetchTvById(item.mediaId);
        }
        return await fetchMovieById(item.mediaId);
      })
    );
    res.json(fetchedItems.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { movieId, mediaType = 'movie' } = req.body; // movieId acts as mediaId
  try {
    const id = Number(movieId);
    if(!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid movieId' });
    let watchlist = await Watchlist.findOne({ user: req.user.userId });
    
    const newItem = { mediaId: id, mediaType };

    let exists = false;

    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user.userId, items: [newItem] });
    } else {
      // Migrate legacy if adding a new item
      if (watchlist.movies && watchlist.movies.length > 0) {
        const existingIds = new Set((watchlist.items || []).map(i => i.mediaId));
        watchlist.movies.forEach(mid => {
          if (!existingIds.has(mid)) {
            watchlist.items.push({ mediaId: mid, mediaType: 'movie' });
          }
        });
        watchlist.movies = []; // Clear legacy array
      }

      if (!watchlist.items) watchlist.items = [];
      exists = watchlist.items.some(i => i.mediaId === id && i.mediaType === mediaType);
      if (!exists) {
        watchlist.items.push(newItem);
      }
    }
    await watchlist.save();
    
    // Create activity
    if (!exists) {
      try {
        await Activity.create({
          user: req.user.userId,
          type: 'USER_ADDED_TO_WATCHLIST',
          mediaId: id,
          mediaType,
        });
      } catch (actErr) {
        console.error('Failed to create watchlist activity:', actErr);
      }
    }
    
    const fetchedItems = await Promise.all(
      watchlist.items.map(async (item) => {
        if (item.mediaType === 'tv') {
          return await fetchTvById(item.mediaId);
        }
        return await fetchMovieById(item.mediaId);
      })
    );
    res.json(fetchedItems.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

router.delete('/:movieId', authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });
    
    // Also remove from legacy array just in case
    if (watchlist.movies) {
      watchlist.movies = watchlist.movies.filter((id) => id !== Number(req.params.movieId));
    }
    
    if (watchlist.items) {
      watchlist.items = watchlist.items.filter((item) => item.mediaId !== Number(req.params.movieId));
    }

    await watchlist.save();
    
    let itemsToFetch = watchlist.items || [];
    if (watchlist.movies && watchlist.movies.length > 0) {
      const existingIds = new Set(itemsToFetch.map(i => i.mediaId));
      watchlist.movies.forEach(id => {
        if (!existingIds.has(id)) {
          itemsToFetch.push({ mediaId: id, mediaType: 'movie' });
        }
      });
    }

    const fetchedItems = await Promise.all(
      itemsToFetch.map(async (item) => {
        if (item.mediaType === 'tv') {
          return await fetchTvById(item.mediaId);
        }
        return await fetchMovieById(item.mediaId);
      })
    );
    res.json(fetchedItems.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;