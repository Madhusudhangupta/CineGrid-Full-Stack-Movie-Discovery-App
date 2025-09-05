require('dotenv').config();
const axios = require('axios');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY is not defined in .env file');
}

const fetchTrendingMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error.response?.data || error.message);
    throw error;
  }
};

const fetchMovieById = async (id) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie by ID:', error.response?.data || error.message);
    throw error;
  }
};

const fetchSimilarMovies = async (movieId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/similar`, {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching similar movies:', error.response?.data || error.message);
    throw error;
  }
};

const fetchVideos = async (movieId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error.response?.data || error.message);
    throw error;
  }
};

// Search movies by query
const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  fetchTrendingMovies,
  fetchMovieById,
  fetchSimilarMovies,
  fetchVideos,
  searchMovies,
};
