import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults, setQuery, clearResults } from "@/store/searchSlice";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Shimmer from "@/components/layout/Shimmer";
import MovieCard from "@/components/movie/MovieCard";

const SearchResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm = "" } = useParams();
  const lastDispatchedRef = useRef('');

  const { query, results, loading, error, page, total_pages, total_results } = useSelector(
    (state) => state.search
  );

  // Hydrate store from URL param on mount/param change
  useEffect(() => {
    const term = (searchTerm || "").trim();
    if (!term) {
      dispatch(clearResults());
      return;
    }
    if (term !== query) {
      dispatch(setQuery(term));
      if (term !== lastDispatchedRef.current) {
        dispatch(fetchSearchResults({ query: term, page: 1 }));
        lastDispatchedRef.current = term;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, dispatch]);

  // If user cleared query elsewhere, go home
  useEffect(() => {
    if (!query.trim() && searchTerm && location.pathname.startsWith("/search/")) {
      navigate("/", { replace: true });
    }
  }, [query, searchTerm, navigate, location.pathname]);

  const handlePageChange = useCallback(
    (targetPage) => {
      if (loading || !query.trim() || targetPage < 1 || targetPage > total_pages || targetPage === page) {
        return;
      }
      dispatch(fetchSearchResults({ query, page: targetPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch, loading, page, query, total_pages]
  );

  const pagination = useMemo(() => {
    if (!total_pages || total_pages <= 1) return [];
    const windowSize = 5;
    const start = Math.max(1, page - Math.floor(windowSize / 2));
    const end = Math.min(total_pages, start + windowSize - 1);
    const adjustedStart = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
  }, [page, total_pages]);

  const title = useMemo(() => `Results for “${query}”`, [query]);

  if (!query.trim()) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {loading && results.length === 0 ? (
        <Shimmer />
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
            alt="No results"
            className="w-24 h-24 mb-4 opacity-70"
          />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No results found
          </h2>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {total_pages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Page {page} of {total_pages} • {total_results} results
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={loading || page <= 1}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-slate-100"
                >
                  Previous
                </button>

                {pagination.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={loading}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      pageNumber === page
                        ? "bg-sky-500 text-white"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={loading || page >= total_pages}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-slate-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
