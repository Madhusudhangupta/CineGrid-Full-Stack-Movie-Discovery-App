const express = require('express');
const {
  fetchTrendingMovies,
  fetchMovieById,
  fetchSimilarMovies,
  searchMovies,
  fetchGenres,
  discoverMovies,
  fetchProviders,
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

// Genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await fetchGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Discover with filters
router.get('/discover', async (req, res) => {
  try {
    const { with_genres, year, sort_by, page } = req.query;
    const data = await discoverMovies({
      with_genres,
      primary_release_year: year ? Number(year) : undefined,
      sort_by,
      page: page ? Number(page) : 1,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to discover movies' });
  }
});

//  Search movies by query
router.get('/search', async (req, res) => {
  try {
    const { query, page } = req.query;
    const normalizedQuery = String(query || '').trim();
    if (!normalizedQuery) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    if (normalizedQuery.length < 2) {
      return res.json({ page: 1, results: [], total_pages: 0, total_results: 0 });
    }
    const numericPage = Number(page);
    const safePage = Number.isFinite(numericPage) && numericPage > 0 ? numericPage : 1;
    const data = await searchMovies(normalizedQuery, safePage);
    console.log('Searched movies', { query: normalizedQuery, count: data?.results?.length || 0 });
    res.json(data);
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

// Where to watch (providers)
router.get('/:id/providers', async (req, res) => {
  try {
    const providers = await fetchProviders(req.params.id);
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

module.exports = router;
