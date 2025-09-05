
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    watchlist: [],
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setWatchlist: (state, action) => {
      state.watchlist = action.payload;
    },
  },
});

export const { setProfile, setWatchlist } = userSlice.actions;
export default userSlice.reducer;