import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { discoverMovies, fetchGenres, fetchTrendingMovies } from '@/utils/api';
import MovieCard from '@/components/movie/MovieCard';
import Shimmer from '@/components/layout/Shimmer';

const DEFAULT_FILTERS = { sort_by: 'popularity.desc' };

const PRESETS = [
  { key: 'popular', label: 'Most Popular', filters: { sort_by: 'popularity.desc' } },
  { key: 'top-rated', label: 'Top Rated', filters: { sort_by: 'vote_average.desc' } },
  { key: 'new', label: 'New Releases', filters: { sort_by: 'release_date.desc' } },
];

export default function Home({ defaultMode = 'trending' }) {
  const { results: searchResults, query, loading: searchLoading } = useSelector(
    (state) => state.search
  );

  const [items, setItems] = useState([]);
  const [mode, setMode] = useState(defaultMode === 'discover' ? 'discover' : 'trending');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(defaultMode === 'discover' ? 'discover' : 'trending');
  }, [defaultMode]);

  useEffect(() => {
    fetchGenres()
      .then((data) => setGenres(Array.isArray(data) ? data : []))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    if (query.trim()) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    const load = async () => {
      try {
        if (mode === 'trending') {
          const data = await fetchTrendingMovies();
          if (!cancelled) setItems(Array.isArray(data) ? data : []);
        } else {
          const data = await discoverMovies({ ...filters, page: 1 });
          if (!cancelled) setItems(Array.isArray(data?.results) ? data.results : []);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setError(mode === 'discover' ? 'Failed to load discover results' : 'Failed to load trending movies');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [query, mode, filters]);

  const updateFilter = (key, value) => {
    setMode('discover');
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const applyPreset = (presetFilters) => {
    setMode('discover');
    setFilters((prev) => ({ ...prev, ...presetFilters }));
  };

  const resetToTrending = () => {
    setMode('trending');
    setFilters(DEFAULT_FILTERS);
  };

  const subtitle = useMemo(() => {
    if (mode === 'trending') return 'Latest popular picks right now';
    const year = filters.primary_release_year ? ` • ${filters.primary_release_year}` : '';
    return `Browse by genre, year and sort${year}`;
  }, [mode, filters]);

  const showSearch = query.trim();
  const displayMovies = useMemo(
    () => (showSearch ? searchResults : items),
    [showSearch, searchResults, items]
  );

  const isLoading = showSearch ? searchLoading : loading;
  const title = showSearch
    ? 'Search Results'
    : mode === 'discover'
      ? 'Discover Movies'
      : 'Trending Movies';

  return (
    <div className="px-0 py-1 sm:py-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
      </div>

      {!showSearch && (
        <>
          <div className="mb-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={resetToTrending}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                mode === 'trending'
                  ? 'bg-sky-500 text-white'
                  : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20'
              }`}
            >
              Trending
            </button>
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => applyPreset(p.filters)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  mode === 'discover' && filters.sort_by === p.filters.sort_by
                    ? 'bg-sky-500 text-white'
                    : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {mode === 'discover' && (
            <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:grid-cols-3 dark:border-white/10 dark:bg-white/5">
              <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium">Genre</span>
                <select
                  value={filters.with_genres || ''}
                  onChange={(e) => updateFilter('with_genres', e.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                >
                  <option value="">All</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium">Year</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 2023"
                  value={filters.primary_release_year || ''}
                  onChange={(e) => updateFilter('primary_release_year', e.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium">Sort by</span>
                <select
                  value={filters.sort_by || 'popularity.desc'}
                  onChange={(e) => updateFilter('sort_by', e.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                >
                  <option value="popularity.desc">Popularity ↓</option>
                  <option value="popularity.asc">Popularity ↑</option>
                  <option value="release_date.desc">Release date ↓</option>
                  <option value="release_date.asc">Release date ↑</option>
                  <option value="vote_average.desc">Rating ↓</option>
                  <option value="vote_average.asc">Rating ↑</option>
                </select>
              </label>
            </div>
          )}
        </>
      )}

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {isLoading && displayMovies.length === 0 ? (
        <Shimmer />
      ) : Array.isArray(displayMovies) && displayMovies.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {displayMovies.map((movie) => (
            <div key={movie.id} className="min-w-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
          <h2 className="text-lg font-semibold mb-2">
            No results found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try searching with a different keyword.
          </p>
        </div>
      )}
    </div>
  );
}
