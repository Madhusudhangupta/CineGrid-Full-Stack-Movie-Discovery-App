
import { createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    movieDetails: {},
  },
  reducers: {
    setTrendingMovies: (state, action) => {
      state.trending = action.payload;
    },
    setMovieDetails: (state, action) => {
      state.movieDetails[action.payload.id] = action.payload;
    },
  },
});

export const { setTrendingMovies, setMovieDetails } = moviesSlice.actions;
export default moviesSlice.reducer;