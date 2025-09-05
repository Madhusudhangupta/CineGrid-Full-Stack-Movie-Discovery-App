import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { fetchTrendingMovies } from "@/utils/api";
import MovieCard from "@/components/movie/MovieCard";
import SearchBar from "@/components/layout/SearchBar";

export default function Home() {
  const { t } = useTranslation();
  const { results: searchResults, query, loading: searchLoading } = useSelector(
    (state) => state.search
  );
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trending only if no search query
  useEffect(() => {
    if (!query.trim()) {
      setLoading(true);
      fetchTrendingMovies()
        .then((data) => {
          const uniqueMovies = Array.from(
            new Map(data.map((movie) => [movie.id, movie])).values()
          );
          setMovies(uniqueMovies);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  const displayMovies = query.trim() ? searchResults : movies;

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-64 w-full shadow-md" />
  );

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 text-black dark:text-white">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">
        {query.trim() ? t("search.results", "Search Results") : t("trending")}
      </h1>

      {/* Search Bar */}
      <SearchBar />

      {/* Grid wrapper for all states */}
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading || searchLoading ? (
          // Skeleton state
          Array.from({ length: 10 }).map((_, idx) => <SkeletonCard key={idx} />)
        ) : Array.isArray(displayMovies) && displayMovies.length > 0 ? (
          // Real movies
          displayMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold mb-2">
              {t("noResults", "No results found")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("tryAnother", "Try searching with a different keyword.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
