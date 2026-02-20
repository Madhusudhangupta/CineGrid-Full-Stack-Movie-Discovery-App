import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/store';
import App from '@/App';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import MovieDetail from '@/pages/MovieDetail';
import PersonDetail from '@/pages/PersonDetail';
import Profile from '@/pages/Profile';
import SearchResults from '@/pages/SearchResults';
import Offline from '@/pages/Offline';
import '@/styles/globals.css';
import NotFound from './pages/NotFound';

// Apply saved theme class before first render.
try {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const shouldDark = storedTheme ? storedTheme === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', shouldDark);
} catch {
  // Ignore theme bootstrap failures in restricted environments.
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="discover" element={<Home defaultMode="discover" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="person/:id" element={<PersonDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search/:searchTerm" element={<SearchResults />} />
            <Route path="offline" element={<Offline />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
