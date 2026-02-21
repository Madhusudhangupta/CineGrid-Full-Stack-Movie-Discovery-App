import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchMovies as apiSearchMovies } from '@/utils/api';

export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async ({ query, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const normalizedQuery = String(query || '').trim();
      if (!normalizedQuery) {
        return { page: 1, results: [], total_pages: 0, total_results: 0, query: '' };
      }
      const data = await apiSearchMovies(normalizedQuery, page, limit); // { page, results, total_pages, total_results }
      return { ...data, query: normalizedQuery };
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to search');
    }
  }
);

const initialState = {
  query: '',
  results: [],
  page: 0,
  total_pages: 0,
  total_results: 0,
  loading: false,
  error: null,
  currentRequestId: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      // do not reset results here—let the page handle UX
    },
    clearResults(state) {
      state.query = '';
      state.results = [];
      state.page = 0;
      state.total_pages = 0;
      state.total_results = 0;
      state.loading = false;
      state.error = null;
      state.currentRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state, action) => {
        const { page = 1 } = action.meta.arg || {};
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
        if (page === 1) {
          state.results = [];
          state.page = 0;
          state.total_pages = 0;
          state.total_results = 0;
        }
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        const { query, results, page, total_pages, total_results } = action.payload;
        if (action.meta.requestId !== state.currentRequestId) return;
        state.loading = false;
        state.currentRequestId = null;

        // If query changed mid-flight, ignore stale responses
        if (query.trim() !== state.query.trim()) return;

        // Show only results for the current page
        state.results = Array.isArray(results) ? results : [];
        state.page = page;
        state.total_pages = total_pages || state.total_pages;
        state.total_results = total_results ?? state.total_results;
        state.error = null;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return;
        state.loading = false;
        state.currentRequestId = null;
        state.error = action.payload || 'Failed to search';
      });
  },
});

export const { setQuery, clearResults } = searchSlice.actions;
export default searchSlice.reducer;





// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../utils/api";

// // Thunk to fetch search results
// export const fetchSearchResults = createAsyncThunk(
//   "search/fetchResults",
//   async (query, { rejectWithValue }) => {
//     try {
//       if (!query.trim()) return []; // return empty if query is blank
//       const res = await api.get(`/movies/search`, {
//         params: { query },
//       });
//       return res.data || [];
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Search failed");
//     }
//   }
// );

// const searchSlice = createSlice({
//   name: "search",
//   initialState: {
//     query: "",
//     results: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setQuery: (state, action) => {
//       state.query = action.payload;
//     },
//     clearResults: (state) => {
//       state.results = [];
//       state.query = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSearchResults.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSearchResults.fulfilled, (state, action) => {
//         state.loading = false;
//         state.results = action.payload;
//       })
//       .addCase(fetchSearchResults.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { setQuery, clearResults } = searchSlice.actions;
// export default searchSlice.reducer;
