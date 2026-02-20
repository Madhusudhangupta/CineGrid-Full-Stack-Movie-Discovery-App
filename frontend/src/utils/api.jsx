import axios from "axios";

const resolveApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || "").trim();
  if (!raw) return "/api";

  try {
    const url = new URL(raw);
    const isLoopback = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (isLoopback && typeof window !== "undefined") {
      const clientHost = window.location.hostname;
      const clientIsLoopback = ["localhost", "127.0.0.1"].includes(clientHost);
      // If app is opened from another device on LAN, reuse that host for API.
      if (!clientIsLoopback) url.hostname = clientHost;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return raw || "/api";
  }
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: false,
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Movies
export const fetchTrendingMovies = async () => {
  const { data } = await api.get("/movies/trending");
  return data;
};

export const fetchMovieById = async (id) => {
  const { data } = await api.get(`/movies/${id}`);
  return data;
};

export const fetchSimilarMovies = async (id) => {
  const { data } = await api.get(`/movies/${id}/similar`);
  return data;
};

export const searchMovies = async (query, page = 1) => {
  const { data } = await api.get(`/movies/search`, { params: { query, page } });
  return data; // { page, results, total_pages, total_results }
};

//  Genres  
export const fetchGenres = async () => {
  const { data } = await api.get("/movies/genres");
  return data; // [{id,name}]
};

// Discover
export const discoverMovies = async (params) => {
  const { data } = await api.get("/movies/discover", { params });
  return data; // { page, results, total_pages, total_results }
};

// Providers
export const fetchProviders = async (id) => {
  const { data } = await api.get(`/movies/${id}/providers`);
  return data; // TMDb providers object keyed by country code
};

// Reviews
export const fetchReviews = async (movieId, { page = 1, limit = 10 } = {}) => {
  const { data } = await api.get(`/reviews/${movieId}`, { params: { page, limit } });
  return data; // {items, page, ...}
};

export const fetchReviewSummary = async (movieId) => {
  const { data } = await api.get(`/reviews/${movieId}/summary`);
  return data; // {count, avg, dist1..dist5}
};

export const postReview = async ({ movieId, rating, comment }) => {
  const { data } = await api.post(`/reviews`, { movieId, rating, comment });
  return data;
};

// Comments 
export const fetchComments = async (movieId, { page = 1, limit = 10 } = {}) => {
  const { data } = await api.get(`/comments/${movieId}`, { params: { page, limit } });
  return data; // {items, ...}
};

export default api;






// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // attach token if present
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const fetchTrendingMovies = async () => {
//   try {
//     const response = await api.get('/movies/trending');
//     // console.log('Trending Movies API Response:', response.data);
//     const movies = response.data.results || response.data || [];
//     // console.log('Trending Movies Extracted:', movies);
//     return Array.isArray(movies) ? movies : [];
//   } catch (error) {
//     console.error('Error fetching trending movies:', error.response?.data || error.message);
//     throw new Error('Failed to fetch trending movies');
//   }
// };

// export const fetchMovieById = async (id) => {
//   try {
//     const response = await api.get(`/movies/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching movie by ID:', error.response?.data || error.message);
//     throw new Error('Failed to fetch movie');
//   }
// };

// export const fetchSimilarMovies = async (movieId) => {
//   try {
//     const response = await api.get(`/movies/${movieId}/similar`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching similar movies:', error.response?.data || error.message);
//     throw new Error('Failed to fetch similar movies');
//   }
// };

// export const searchMovies = async (query, page = 1) => {
//   const { data } = await api.get(`/movies/search`, { params: { query, page } });
//   return data; // { page, results, total_pages, total_results }
// };

// export const fetchGenres = async () => {
//   const { data } = await api.get("/movies/genres");
//   return data; // [{id,name}]
// };

// export const discoverMovies = async (params) => {
//   const { data } = await api.get("/movies/discover", { params });
//   return data; // { page, results, total_pages, total_results }
// };

// export const fetchProviders = async (id) => {
//   const { data } = await api.get(`/movies/${id}/providers`);
//   return data; // TMDb providers object keyed by country code
// };

// export const fetchReviews = async (movieId) => {
//   const response = await api.get(`/reviews/${movieId}`);
//   return response.data;
// };

// export const fetchReviewSummary = async (movieId) => {
//   const { data } = await api.get(`/reviews/${movieId}/summary`);
//   return data; // {count, avg, dist1..dist5}
// };

// export const postReview = async (movieId, rating, comment) => {
//   const response = await api.post('/reviews', { movieId, rating, comment });
//   return response.data;
// };

// export const fetchComments = async (movieId) => {
//   const response = await api.get(`/comments/${movieId}`);
//   return response.data;
// };

// export const postComment = async (movieId, comment) => {
//   const response = await api.post('/comments', { movieId, comment });
//   return response.data;
// };

// export const deleteComment = async (commentId) => {
//   const response = await api.delete(`/comments/${commentId}`);
//   return response.data;
// };

// export const fetchRecommendations = async () => {
//   const response = await api.get('/recommendations');
//   return response.data;
// };

// export const postRecommendation = async (movieId, reason) => {
//   const response = await api.post('/recommendations', { movieId, reason });
//   return response.data;
// };

// export const fetchWatchlist = async () => {
//   const response = await api.get('/watchlist');
//   return response.data;
// };

// export const addToWatchlist = async (movieId) => {
//   const response = await api.post('/watchlist', { movieId });
//   return response.data;
// };

// export const removeFromWatchlist = async (movieId) => {
//   const response = await api.delete(`/watchlist/${movieId}`);
//   return response.data;
// };

// export default api;
