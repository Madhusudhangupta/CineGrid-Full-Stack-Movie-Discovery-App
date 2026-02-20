import { useEffect, useState } from 'react';
import { fetchGenres } from '@/utils/api';
import { FiSliders, FiChevronDown } from 'react-icons/fi';

export default function FiltersPanel({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const [local, setLocal] = useState(value || {});

  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    setLocal(value || {});
  }, [value]);

  const handleApply = () => onChange?.(local);

  return (
    <section className="w-full">
      {/* HORIZONTAL TOOLBAR */}
      <div className="w-full nav-glass rounded-2xl px-4 py-4 md:px-5 md:py-5 flex flex-wrap items-end gap-3 md:gap-4">
        {/* Title */}
        <div className="flex w-full items-center gap-2 pr-2 lg:w-auto">
          <span className="p-2 rounded-lg bg-white/10 text-white"><FiSliders /></span>
          <h2 className="text-base md:text-lg font-semibold text-white/90 whitespace-nowrap">
            Refine your discovery
          </h2>
        </div>

        {/* Genre */}
        <div className="w-full sm:w-[48%] lg:w-56">
          <label className="filter-label">Genre</label>
          <div className="relative">
            <select
              value={local.with_genres || ''}
              onChange={(e) => setLocal({ ...local, with_genres: e.target.value })}
              className="filter-select"
            >
              <option value="">All</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <FiChevronDown className="select-caret" />
          </div>
        </div>

        {/* Year */}
        <div className="w-full sm:w-[48%] lg:w-40">
          <label className="filter-label">Year</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 2023"
            value={local.primary_release_year || ''}
            onChange={(e) => setLocal({ ...local, primary_release_year: e.target.value })}
            className="filter-input"
          />
        </div>

        {/* Sort */}
        <div className="w-full sm:w-[48%] lg:w-64">
          <label className="filter-label">Sort by</label>
          <div className="relative">
            <select
              value={local.sort_by || 'popularity.desc'}
              onChange={(e) => setLocal({ ...local, sort_by: e.target.value })}
              className="filter-select"
            >
              <option value="popularity.desc">Popularity ↓</option>
              <option value="popularity.asc">Popularity ↑</option>
              <option value="release_date.desc">Release date ↓</option>
              <option value="release_date.asc">Release date ↑</option>
              <option value="vote_average.desc">Rating ↓</option>
              <option value="vote_average.asc">Rating ↑</option>
            </select>
            <FiChevronDown className="select-caret" />
          </div>
        </div>

        {/* Apply */}
        <div className="w-full sm:w-[48%] lg:ml-auto lg:w-auto">
          <button
            onClick={handleApply}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-white text-gray-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Apply
          </button>
        </div>
      </div>
    </section>
  );
}
