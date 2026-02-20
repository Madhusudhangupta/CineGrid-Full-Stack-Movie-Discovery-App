
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import moviesReducer from './moviesSlice';
import searchReducer from './searchSlice';
import themeReducer from './themeSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    search: searchReducer,
    theme: themeReducer,
    user: userReducer,
  },
});

export default store;
