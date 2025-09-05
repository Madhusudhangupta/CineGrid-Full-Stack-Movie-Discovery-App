import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults } from "../store/searchSlice";
import Shimmer from "@/components/layout/Shimmer";

const SearchResults = () => {
  const dispatch = useDispatch();
  const { query, results, loading, error } = useSelector((state) => state.search);

  useEffect(() => {
    if (query.trim()) {
      dispatch(fetchSearchResults(query));
    }
  }, [query, dispatch]);

  // If query is empty → don't render anything
  if (!query.trim()) {
    return null;
  }

  // Show shimmer while API is fetching
  if (loading) {
    return <Shimmer />;
  }

  // Show error if API fails
  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  // Show a nice empty state if no results found AFTER loading
  if (!loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
          alt="No results"
          className="w-24 h-24 mb-4 opacity-70"
        />
        <h2 className="text-lg font-semibold text-gray-300">
          No results found
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  // Render search results in a responsive grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {results.map((movie) => (
        <div
          key={movie.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-2">
            <h3 className="text-white text-sm font-semibold truncate">
              {movie.title}
            </h3>
            <p className="text-gray-400 text-xs">{movie.release_date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
