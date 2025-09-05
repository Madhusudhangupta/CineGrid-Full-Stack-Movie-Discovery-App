import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/internationalize';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="movie/:id" element={<MovieDetail />} />
              <Route path="person/:id" element={<PersonDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="search/:searchTerm" element={<SearchResults />} />
              <Route path="offline" element={<Offline />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);