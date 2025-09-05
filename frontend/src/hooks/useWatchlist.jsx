
import { useSelector, useDispatch } from 'react-redux';
import { setWatchlist } from '@/store/userSlice';
import api from '@/utils/api';
import { useEffect } from 'react';

export const useWatchlist = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.user.watchlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/watchlist').then((response) => {
        dispatch(setWatchlist(response.data));
      });
    }
  }, [isAuthenticated, dispatch]);

  const addToWatchlist = async (movieId) => {
    try {
      const response = await api.post('/watchlist', { movieId });
      dispatch(setWatchlist(response.data));
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await api.delete(`/watchlist/${movieId}`);
      dispatch(setWatchlist(response.data));
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    }
  };

  return { watchlist, addToWatchlist, removeFromWatchlist };
};