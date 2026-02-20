import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, clearResults, fetchSearchResults } from "@/store/searchSlice";
import useDebounce from "@/hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchBar() {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.search);
  const [inputValue, setInputValue] = useState(query);
  const debouncedQuery = useDebounce(inputValue, 500);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const prevPathRef = useRef(location.pathname);
  const currentPathRef = useRef(location.pathname);
  const latestInputRef = useRef(inputValue);

  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    latestInputRef.current = inputValue;
  }, [inputValue]);

  // Keep local input in sync only when global query is cleared elsewhere.
  useEffect(() => {
    if (!query && inputValue) {
      setInputValue("");
    }
  }, [query, inputValue]);

  // Fetch and sync route when debounced query changes.
  // Do not depend on pathname changes here; that can replay stale values.
  useEffect(() => {
    const normalized = debouncedQuery.trim();
    if (!latestInputRef.current.trim()) return;
    if (normalized) {
      dispatch(fetchSearchResults({ query: normalized, page: 1 }));
      const target = `/search/${encodeURIComponent(normalized)}`;
      if (currentPathRef.current !== target) {
        navigate(target, { replace: true });
      }
    }
  }, [debouncedQuery, dispatch, navigate]);

  // Keep focus after route transitions while user is searching,
  // and also when clearing search moves /search/... back to /.
  useEffect(() => {
    const fromSearchToHome =
      prevPathRef.current.startsWith("/search/") && location.pathname === "/";

    if ((inputValue.trim() || fromSearchToHome) && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, inputValue]);

  const handleClear = () => {
    setInputValue("");
    dispatch(clearResults());
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          const nextValue = e.target.value;
          setInputValue(nextValue);
          if (!nextValue.trim()) {
            handleClear();
            return;
          }
          dispatch(setQuery(nextValue));
        }}
        placeholder="Search movies..."
        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-11 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
      />
      {inputValue && (
        <button
          type="button"
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <span className="text-lg leading-none">&times;</span>
        </button>
      )}
    </div>
  );
}
