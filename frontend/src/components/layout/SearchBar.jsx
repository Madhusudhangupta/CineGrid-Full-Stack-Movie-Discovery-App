import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, fetchSearchResults } from "@/store/searchSlice";
import useDebounce from "@/hooks/useDebounce";

export default function SearchBar() {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.search);
  const debouncedQuery = useDebounce(query, 500);

  // fetch whenever debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(fetchSearchResults(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  return (
    <div className="w-full flex justify-center my-4">
      <input
        type="text"
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        placeholder="Search movies..."
        className="w-1/2 px-3 py-2 border rounded-lg shadow-md focus:outline-none focus:ring dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}
