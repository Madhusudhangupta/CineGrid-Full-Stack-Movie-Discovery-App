require('dotenv').config();
const axios = require('axios');
const https = require('https');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY is not defined in .env file');
}

// axios instance with HTTPS agent
const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false
})

// simple in-memory cache with TTL
const cache = new Map(); // key -> { expires, data }
const setCache = (key, data, ttlMs = 5*60*1000) => {
  cache.set(key, { expires: Date.now() + ttlMs, data });
  return data;
};
const getCache = (key) => {
  const hit = cache.get(key);
  if(!hit) return null;
  if(Date.now() > hit.expires) {
    cache.delete(key);
    return null; 
  }
  return hit.data;
};

const fetchTrendingMovies = async (mediaType = 'movie') => {
  try {
    const ck = `trending:week:${mediaType}`;
    const cached = getCache(ck);
    if(cached) return cached;
    const response = await axios.get(`${TMDB_BASE_URL}/trending/${mediaType}/week`, {
      params: { api_key: TMDB_API_KEY },
    });
    // Ensure media_type is present for frontend
    const results = (response.data.results || []).map(item => ({ ...item, media_type: item.media_type || mediaType }));
    return setCache(ck, results, 10*60*1000);
  } catch (error) {
    console.error('Error fetching trending:', error.response?.data || error.message);
    throw error;
  }
};

const fetchMovieById = async (movieId) => {
  try {
    const ck = `movie:${movieId}`;
    const cached = getCache(ck);
    if(cached) return cached;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: { api_key: TMDB_API_KEY },
    });
    // Ensure media_type is present for frontend
    const data = { ...response.data, media_type: 'movie' };
    return setCache(ck, data, 60*60*1000);
  } catch (error) {
    console.error('Error fetching movie by ID:', error.response?.data || error.message);
    throw error;
  }
};

const fetchTvById = async (tvId) => {
  try {
    const ck = `tv:${tvId}`;
    const cached = getCache(ck);
    if(cached) return cached;
    const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvId}`, {
      params: { api_key: TMDB_API_KEY },
    });
    const data = { ...response.data, media_type: 'tv' };
    return setCache(ck, data, 60*60*1000);
  } catch (error) {
    console.error('Error fetching TV by ID:', error.response?.data || error.message);
    throw error;
  }
};

const fetchSimilarMovies = async (movieId) => {
  try {
    const ck = `similar:${movieId}`;
    const cached = getCache(ck);
    if(cached) return cached;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/similar`, {
      params: { api_key: TMDB_API_KEY },
    });
    return setCache(ck, response.data.results, 30*60*1000);
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

// Search multi by query (paginated TMDB response)
const searchMovies = async (query, page = 1, limit = 20) => {
  try {
    const resultsPerTmdbPage = 20;
    const pagesNeeded = Math.ceil(limit / resultsPerTmdbPage);

    // Fetch pagesNeeded pages starting from `page`
    const allResults = [];
    let totalResults = 0;
    let totalPagesFromTmdb = 0;

    for (let i = 0; i < pagesNeeded; i++) {
      const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: { api_key: TMDB_API_KEY, query, page: page + i },
      });

      if (i === 0) {
        totalResults = response.data.total_results || 0;
        totalPagesFromTmdb = response.data.total_pages || 0;
      }

      // Filter out people, keep movies and tv
      const filtered = (response.data.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv');
      allResults.push(...filtered);
    }

    // Always slice to the requested limit
    const sliced = allResults.slice(0, limit);

    return {
      page,
      results: sliced,
      total_pages: Math.ceil(totalResults / limit) || Math.ceil((sliced.length || 0) / limit),
      total_results: totalResults || sliced.length,
    };
  } catch (error) {
    console.error('Error searching:', error.response?.data || error.message);
    throw error;
  }
};

// fetch genres
const fetchGenres = async (mediaType = 'movie') => {
  try {
    const ck = `genres:${mediaType}`;
    const cached = getCache(ck);
    if(cached) return cached;

    const { data } = await axios.get(`${TMDB_BASE_URL}/genre/${mediaType}/list`, {
      params: { api_key: TMDB_API_KEY},
    });
    return setCache(ck, data.genres, 24*60*60*1000);
  } catch (error) {
    console.error('Error fetching genres:', error.response?.data || error.message);
    throw error;
  }
}

// discover
const discoverMovies = async (input = {}) => {
  try {
    const mediaType = input.mediaType || 'movie';
    const params = {
      api_key: TMDB_API_KEY,
      page: 1,
      ...input,
    };
    delete params.mediaType;
    Object.keys(params).forEach((k) => params[k] == null && delete params[k]);

    const { data } = await axios.get(`${TMDB_BASE_URL}/discover/${mediaType}`, { params });
    // Ensure media_type is present
    if (data.results) {
      data.results = data.results.map(item => ({ ...item, media_type: mediaType }));
    }
    return data;
  } catch (error) {
    console.error('Error discovering:', error.response?.data || error.message);
    throw error;
  }
};

const fetchPersonMovieCredits = async (personId) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/person/${personId}/movie_credits`, {
      params: { api_key: TMDB_API_KEY },
    });
    return data;
  } catch (error) {
    console.error('Error fetching person movie credits:', error.response?.data || error.message);
    throw error;
  }
};

const fetchProviders = async (movieId) => {
  try {
    const ck = `providers:${movieId}`;
    const cached = getCache(ck);
    if (cached) return cached;

    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers`, {
      params: { api_key: TMDB_API_KEY },
    });
    return setCache(ck, data.results || {}, 12 * 60 * 60 * 1000); // 12 hours
  } catch (error) {
    console.error('Error fetching providers:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  fetchTrendingMovies,
  fetchMovieById,
  fetchTvById,
  fetchSimilarMovies,
  fetchVideos,
  searchMovies,
  fetchGenres,
  discoverMovies,
  fetchProviders,
  fetchPersonMovieCredits,
};
