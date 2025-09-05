
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '@/store/authSlice';
import api from '@/utils/api';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      api.get('/auth/me').then((response) => {
        dispatch(login(response.data.user));
      }).catch(() => {
        localStorage.removeItem('token');
        dispatch(logout());
      });
    }
  }, [dispatch, isAuthenticated]);

  return { isAuthenticated, user };
};