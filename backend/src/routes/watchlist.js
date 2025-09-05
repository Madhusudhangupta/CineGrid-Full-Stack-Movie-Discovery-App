
const express = require('express');
const authMiddleware = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');
const { fetchMovieById } = require('../utils/api');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.userId });
    if (!watchlist) return res.json([]);
    const movies = await Promise.all(
      watchlist.movies.map(async (movieId) => await fetchMovieById(movieId))
    );
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { movieId } = req.body;
  try {
    let watchlist = await Watchlist.findOne({ user: req.user.userId });
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user.userId, movies: [movieId] });
    } else {
      if (!watchlist.movies.includes(movieId)) {
        watchlist.movies.push(movieId);
      }
    }
    await watchlist.save();
    const movies = await Promise.all(
      watchlist.movies.map(async (id) => await fetchMovieById(id))
    );
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

router.delete('/:movieId', authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });
    watchlist.movies = watchlist.movies.filter((id) => id !== Number(req.params.movieId));
    await watchlist.save();
    const movies = await Promise.all(
      watchlist.movies.map(async (id) => await fetchMovieById(id))
    );
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;