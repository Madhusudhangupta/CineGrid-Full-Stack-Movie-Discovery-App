import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { discoverMovies, fetchGenres } from '@/utils/api';
import MovieCard from '@/components/movie/MovieCard';
import Shimmer from '@/components/layout/Shimmer';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const PRESETS = [
  { key: 'popular', label: 'Most Popular', filters: { sort_by: 'popularity.desc' } },
  { key: 'top-rated', label: 'Top Rated', filters: { sort_by: 'vote_average.desc' } },
  { key: 'new', label: 'New Releases', filters: { sort_by: 'release_date.desc' } },
];

export default function Discover() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ sort_by: 'popularity.desc' });
  const [genres, setGenres] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasMore = page < totalPages;

  const loadDiscover = useCallback(
    async (nextPage = 1, nextFilters = filters) => {
      setLoading(true);
      setError('');
      try {
        const { results, page: p, total_pages } = await discoverMovies({
          ...nextFilters,
          page: nextPage,
        });
        setItems((prev) => (nextPage === 1 ? results : [...prev, ...results]));
        setPage(p);
        setTotalPages(total_pages);
      } catch {
        setError('Failed to load discover results');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    loadDiscover(1, filters);
  }, [filters, loadDiscover]);

  useEffect(() => {
    fetchGenres().then((data) => setGenres(Array.isArray(data) ? data : [])).catch(() => setGenres([]));
  }, []);

  const applyPreset = (presetFilters) => {
    setFilters((prev) => ({ ...prev, ...presetFilters }));
    setPage(1);
    setTotalPages(1);
  };

  const { sentinelRef } = useInfiniteScroll({
    hasMore: hasMore && !loading,
    onLoadMore: () => loadDiscover(page + 1),
    rootMargin: '300px',
  });

  const subtitle = useMemo(() => {
    const year = filters.primary_release_year ? ` • ${filters.primary_release_year}` : '';
    return `Filter by genre, year and sort order${year}`;
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(1);
    setTotalPages(1);
  };

  return (
    <div className="px-0 py-1 sm:py-2">
      <div className="mb-4 flex flex-col gap-2 sm:mb-5">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
          {t('discover', 'Discover')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p.filters)}
            className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
          >
            {p.label}
          </button>
        ))}
      </div>

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

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {loading && items.length === 0 ? (
        <Shimmer />
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((movie) => (
              <div key={movie.id} className="min-w-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <div ref={sentinelRef} className="py-6 text-center text-sm opacity-70">
            {loading && hasMore ? 'Loading more…' : !hasMore ? '— End —' : null}
          </div>
        </>
      ) : (
        <div className="py-10 text-center">
          <h2 className="text-lg font-semibold mb-2">{t('noResults', 'No results found')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('tryAnother', 'Try adjusting your filters.')}
          </p>
        </div>
      )}
    </div>
  );
}
