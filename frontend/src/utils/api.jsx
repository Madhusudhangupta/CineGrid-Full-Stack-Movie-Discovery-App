import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTrendingMovies = async () => {
  try {
    const response = await api.get('/movies/trending');
    // console.log('Trending Movies API Response:', response.data);
    const movies = response.data.results || response.data || [];
    // console.log('Trending Movies Extracted:', movies);
    return Array.isArray(movies) ? movies : [];
  } catch (error) {
    console.error('Error fetching trending movies:', error.response?.data || error.message);
    throw new Error('Failed to fetch trending movies');
  }
};

export const fetchMovieById = async (id) => {
  try {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie by ID:', error.response?.data || error.message);
    throw new Error('Failed to fetch movie');
  }
};

export const fetchSimilarMovies = async (movieId) => {
  try {
    const response = await api.get(`/movies/${movieId}/similar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching similar movies:', error.response?.data || error.message);
    throw new Error('Failed to fetch similar movies');
  }
};

export const fetchReviews = async (movieId) => {
  const response = await api.get(`/reviews/${movieId}`);
  return response.data;
};

export const postReview = async (movieId, rating, comment) => {
  const response = await api.post('/reviews', { movieId, rating, comment });
  return response.data;
};

export const fetchComments = async (movieId) => {
  const response = await api.get(`/comments/${movieId}`);
  return response.data;
};

export const postComment = async (movieId, comment) => {
  const response = await api.post('/comments', { movieId, comment });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export const fetchRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const postRecommendation = async (movieId, reason) => {
  const response = await api.post('/recommendations', { movieId, reason });
  return response.data;
};

export const fetchWatchlist = async () => {
  const response = await api.get('/watchlist');
  return response.data;
};

export const addToWatchlist = async (movieId) => {
  const response = await api.post('/watchlist', { movieId });
  return response.data;
};

export const removeFromWatchlist = async (movieId) => {
  const response = await api.delete(`/watchlist/${movieId}`);
  return response.data;
};

export default api;