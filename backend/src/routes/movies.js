const express = require('express');
const {
  fetchTrendingMovies,
  fetchMovieById,
  fetchSimilarMovies,
  searchMovies,
} = require('../utils/api');

const router = express.Router();

//  Trending movies
router.get('/trending', async (req, res) => {
  try {
    const movies = await fetchTrendingMovies();
    console.log('Fetched trending movies', { count: movies.length });
    res.json(movies);
  } catch (error) {
    console.error('Failed to fetch trending movies', { error });
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

//  Search movies by query
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const results = await searchMovies(query);
    console.log('Searched movies', { query, count: results.length });
    res.json(results);
  } catch (error) {
    console.error('Failed to search movies', { error });
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

//  Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await fetchMovieById(req.params.id);
    console.log('Fetched movie by ID', { id: req.params.id });
    res.json(movie);
  } catch (error) {
    console.error('Failed to fetch movie', { error, id: req.params.id });
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

//  Get similar movies
router.get('/:id/similar', async (req, res) => {
  try {
    const movies = await fetchSimilarMovies(req.params.id);
    console.log('Fetched similar movies', { id: req.params.id, count: movies.length });
    res.json(movies);
  } catch (error) {
    console.error('Failed to fetch similar movies', { error, id: req.params.id });
    res.status(500).json({ error: 'Failed to fetch similar movies' });
  }
});

module.exports = router;
