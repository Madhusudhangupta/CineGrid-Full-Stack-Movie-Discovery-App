import { createSlice } from '@reduxjs/toolkit';

const getInitial = () => {
  if (typeof window === 'undefined') return { isDarkMode: false, userPref: null };
  try {
    const stored = localStorage.getItem('theme'); // 'dark' | 'light' | null
    if (stored === 'dark') return { isDarkMode: true, userPref: 'dark' };
    if (stored === 'light') return { isDarkMode: false, userPref: 'light' };
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { isDarkMode: prefersDark, userPref: null };
  } catch {
    return { isDarkMode: false, userPref: null };
  }
};

const initialState = getInitial();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode;
      state.userPref = state.isDarkMode ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', state.userPref);
      } catch {
        return;
      }
    },
    setTheme(state, action) {
      const mode = action.payload === 'dark' ? 'dark' : 'light';
      state.isDarkMode = mode === 'dark';
      state.userPref = mode;
      try {
        localStorage.setItem('theme', mode);
      } catch {
        return;
      }
    },
    systemThemeChanged(state, action) {
      // Only follow system if user hasn't explicitly chosen
      if (state.userPref == null) {
        const mode = action.payload === 'dark' ? 'dark' : 'light';
        state.isDarkMode = mode === 'dark';
      }
    },
  },
});

export const { toggleTheme, setTheme, systemThemeChanged } = themeSlice.actions;
export default themeSlice.reducer;
